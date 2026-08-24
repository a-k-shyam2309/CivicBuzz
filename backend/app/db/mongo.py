"""
CivicBuzz Document Database Connector (MongoDB Atlas / Motor Async)
Handles MongoDB collections, indexes, and resilient fallback for local demo.
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("civicbuzz.db.mongo")


class InMemoryMongoCollection:
    """Lightweight in-memory MongoDB-compatible collection for offline demo/test."""

    def __init__(self, name: str):
        self.name = name
        self._docs: Dict[str, Dict[str, Any]] = {}

    async def insert_one(self, doc: Dict[str, Any]) -> Any:
        _id = str(doc.get("_id") or doc.get("id") or doc.get("complaint_id") or len(self._docs) + 1)
        doc_copy = dict(doc)
        doc_copy["_id"] = _id
        self._docs[_id] = doc_copy

        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id

        return InsertResult(_id)

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        for doc in self._docs.values():
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        results = []
        for doc in self._docs.values():
            match = True
            for k, v in query.items():
                if k == "$or" and isinstance(v, list):
                    or_match = any(all(doc.get(sub_k) == sub_v for sub_k, sub_v in condition.items()) for condition in v)
                    if not or_match:
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(dict(doc))

        class AsyncCursor:
            def __init__(self, items):
                self._items = items

            def sort(self, key, direction=1):
                self._items.sort(key=lambda x: x.get(key, 0), reverse=(direction == -1))
                return self

            def limit(self, n):
                self._items = self._items[:n]
                return self

            def skip(self, n):
                self._items = self._items[n:]
                return self

            async def to_list(self, length=None):
                if length is not None:
                    return self._items[:length]
                return list(self._items)

            def __aiter__(self):
                self._iter = iter(self._items)
                return self

            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        return AsyncCursor(results)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> Any:
        doc = await self.find_one(query)
        if doc:
            _id = doc["_id"]
            if "$set" in update:
                self._docs[_id].update(update["$set"])
            if "$inc" in update:
                for k, v in update["$inc"].items():
                    self._docs[_id][k] = self._docs[_id].get(k, 0) + v
            if "$push" in update:
                for k, v in update["$push"].items():
                    self._docs[_id].setdefault(k, []).append(v)
            return True
        elif upsert:
            new_doc = dict(query)
            if "$set" in update:
                new_doc.update(update["$set"])
            await self.insert_one(new_doc)
            return True
        return False

    async def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        cursor = self.find(query)
        res = await cursor.to_list()
        return len(res)

    async def delete_one(self, query: Dict[str, Any]) -> bool:
        doc = await self.find_one(query)
        if doc:
            del self._docs[doc["_id"]]
            return True
        return False

    async def create_index(self, *args, **kwargs):
        pass


class InMemoryMongoDatabase:
    """In-memory database proxy when MongoDB Atlas is offline or in local test."""

    def __init__(self, name: str):
        self.name = name
        self._collections: Dict[str, InMemoryMongoCollection] = {}

    def __getitem__(self, item: str) -> InMemoryMongoCollection:
        if item not in self._collections:
            self._collections[item] = InMemoryMongoCollection(item)
        return self._collections[item]

    def __getattr__(self, name: str) -> InMemoryMongoCollection:
        return self[name]

    def get_collection(self, name: str) -> InMemoryMongoCollection:
        return self[name]


client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None
is_mongo_in_memory: bool = False


async def init_mongo() -> None:
    """Initialize MongoDB connection and create indexes."""
    global client, db, is_mongo_in_memory
    if settings.MONGO_URL and "mongodb" in settings.MONGO_URL:
        try:
            client = AsyncIOMotorClient(
                settings.MONGO_URL,
                serverSelectionTimeoutMS=2000,
            )
            # Ping database
            await client.admin.command("ping")
            db = client[settings.MONGO_DB_NAME]
            is_mongo_in_memory = False
            logger.info(f"Connected to MongoDB Atlas: {settings.MONGO_DB_NAME}")

            # Create geospatial & query indexes
            await db.complaints.create_index([("location_point", "2dsphere")])
            await db.complaints.create_index([("status", 1), ("created_at", -1)])
            await db.complaints.create_index([("complaint_id", 1)], unique=True)
            await db.complaints.create_index([("ward_id", 1)])
            await db.complaints.create_index([("user_id", 1)])
            await db.audit_logs.create_index([("timestamp", -1)])
            await db.audit_logs.create_index([("entity_type", 1), ("entity_id", 1)])
            return
        except Exception as e:
            logger.warning(f"MongoDB connection failed ({e}). Falling back to resilient in-memory collection store.")

    # Fallback in-memory database
    db = InMemoryMongoDatabase(settings.MONGO_DB_NAME)  # type: ignore
    is_mongo_in_memory = True
    logger.info("Using resilient in-memory MongoDB store.")


async def get_mongo_db() -> AsyncIOMotorDatabase:
    """Dependency / helper to get active MongoDB database instance."""
    global db
    if db is None:
        await init_mongo()
    return db  # type: ignore


async def close_mongo() -> None:
    """Close MongoDB connection pool on shutdown."""
    global client
    if client:
        client.close()
        logger.info("MongoDB client closed.")
