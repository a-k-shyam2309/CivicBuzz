"""
CivicBuzz Relational Database Connector (PostgreSQL / SQLite Fallback)
Manages SQLAlchemy async engines, sessions, and base models.
"""

import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

logger = logging.getLogger("civicbuzz.db.postgres")


class Base(DeclarativeBase):
    pass


# Database URL handling with auto SQLite fallback
db_url = settings.POSTGRES_URL or "sqlite+aiosqlite:///./civicbuzz.db"

# If SQLite or testing, configure SQLite connection
is_sqlite = "sqlite" in db_url

engine = create_async_engine(
    db_url,
    echo=settings.POSTGRES_ECHO,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables, falling back to SQLite if PostgreSQL server is offline."""
    global engine, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            import app.models.sql  # noqa: F401
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Relational database tables initialized successfully.")
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Switching to local SQLite engine fallback.")
        fallback_url = "sqlite+aiosqlite:///./civicbuzz.db"
        engine = create_async_engine(fallback_url, echo=settings.POSTGRES_ECHO, future=True)
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
        async with engine.begin() as conn:
            import app.models.sql  # noqa: F401
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Local SQLite database initialized.")
