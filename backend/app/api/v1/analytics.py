"""
CivicBuzz Analytics API Router
Provides comprehensive municipal KPI metrics, historical trends, departmental performance,
ward heatmaps, category distributions, SLA compliance, AI predictive alerts, and report exports.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_mongo_db
from app.schemas.analytics import (
    AIInsightsResponse,
    AnalyticsOverviewResponse,
    CategoryAnalytics,
    DepartmentAnalytics,
    SLAComplianceResponse,
    TrendsResponse,
    WardAnalytics,
)
from app.schemas.common import APIResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Civic Analytics & Intelligence"])


@router.get("/overview", response_model=APIResponse[AnalyticsOverviewResponse])
async def get_analytics_overview(
    timeframe: str = Query("30d", description="Timeframe: today, 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Get top-level KPI metrics, resolution velocity, CSAT, MTTR, and resource efficiency.
    """
    data = await AnalyticsService.get_overview(timeframe=timeframe, mongo_db=mongo_db, db=db)
    return APIResponse(data=data, message=f"Analytics overview for timeframe '{timeframe}' retrieved.")


@router.get("/trends", response_model=APIResponse[TrendsResponse])
async def get_analytics_trends(
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    interval: str = Query("daily", description="Aggregation interval: daily, weekly, monthly"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Get time-series historical grievance volume vs resolutions vs overdue trends.
    """
    data = await AnalyticsService.get_trends(timeframe=timeframe, interval=interval, mongo_db=mongo_db)
    return APIResponse(data=data)


@router.get("/departments", response_model=APIResponse[List[DepartmentAnalytics]])
async def get_department_analytics(
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Get departmental resolution performance, SLA compliance rates, and workload indexes.
    """
    data = await AnalyticsService.get_departments(timeframe=timeframe, mongo_db=mongo_db, db=db)
    return APIResponse(data=data)


@router.get("/wards", response_model=APIResponse[List[WardAnalytics]])
async def get_ward_analytics(
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Get ward-level grievance density, risk indexes, and resolution leaderboard.
    """
    data = await AnalyticsService.get_wards(timeframe=timeframe, mongo_db=mongo_db, db=db)
    return APIResponse(data=data)


@router.get("/categories", response_model=APIResponse[List[CategoryAnalytics]])
async def get_category_analytics(
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Get grievance breakdown by category, sub-category, and severity levels.
    """
    data = await AnalyticsService.get_categories(timeframe=timeframe, mongo_db=mongo_db)
    return APIResponse(data=data)


@router.get("/sla", response_model=APIResponse[SLAComplianceResponse])
async def get_sla_analytics(
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Get SLA compliance on-time %, escalation funnel, and department breakdown.
    """
    data = await AnalyticsService.get_sla_stats(timeframe=timeframe, mongo_db=mongo_db, db=db)
    return APIResponse(data=data)


@router.get("/ai-insights", response_model=APIResponse[AIInsightsResponse])
async def get_ai_insights(
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Get AI-driven civic intelligence, predictive surge alerts, and municipal resource suggestions.
    """
    data = await AnalyticsService.get_ai_insights(mongo_db=mongo_db, db=db)
    return APIResponse(data=data)


@router.get("/export")
async def export_analytics_data(
    format: str = Query("json", description="Export format: json or csv"),
    timeframe: str = Query("30d", description="Timeframe: 7d, 30d, 90d, 1y"),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Export full aggregated analytics dataset in JSON or CSV format.
    """
    overview = await AnalyticsService.get_overview(timeframe=timeframe, mongo_db=mongo_db, db=db)
    departments = await AnalyticsService.get_departments(timeframe=timeframe, mongo_db=mongo_db, db=db)
    wards = await AnalyticsService.get_wards(timeframe=timeframe, mongo_db=mongo_db, db=db)
    categories = await AnalyticsService.get_categories(timeframe=timeframe, mongo_db=mongo_db)

    if format.lower() == "csv":
        import io
        import csv

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["WARD_ID", "WARD_NAME", "ZONE", "TOTAL_ISSUES", "RESOLVED", "ACTIVE", "RISK_INDEX", "RESOLUTION_RATE_%", "TOP_CATEGORY"])
        for w in wards:
            writer.writerow([
                w.ward_id,
                w.ward_name,
                w.zone,
                w.total_issues,
                w.resolved_issues,
                w.active_issues,
                w.risk_index,
                f"{w.resolution_rate_percent}%",
                w.top_issue_category,
            ])
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=civicbuzz_analytics_{timeframe}.csv"}
        )

    return APIResponse(
        data={
            "overview": overview.model_dump(),
            "departments": [d.model_dump() for d in departments],
            "wards": [w.model_dump() for w in wards],
            "categories": [c.model_dump() for c in categories],
        }
    )
