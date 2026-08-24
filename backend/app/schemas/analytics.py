"""
CivicBuzz Analytics Schemas
Pydantic data transfer models for municipal and grievance analytics.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class KPIMetric(BaseModel):
    label: str
    value: str
    raw_value: float
    unit: Optional[str] = None
    change_percent: float = 0.0
    trend: str = "neutral"  # "up", "down", "neutral"
    subtext: str = ""
    target: Optional[str] = None


class AnalyticsOverviewResponse(BaseModel):
    timeframe: str
    total_complaints: int
    resolved_complaints: int
    in_progress_complaints: int
    overdue_complaints: int
    resolution_rate_percent: float
    avg_resolution_time_hours: float
    avg_first_response_hours: float
    sla_compliance_percent: float
    csat_score: float  # e.g., 4.6 out of 5.0
    active_hotspots_count: int
    budget_utilized_inr: float
    active_citizens_count: int
    kpis: List[KPIMetric] = []


class TrendDataPoint(BaseModel):
    date: str
    label: str
    reported: int
    resolved: int
    overdue: int
    sla_breached: int = 0
    budget_allocated_inr: float = 0.0


class TrendsResponse(BaseModel):
    timeframe: str
    interval: str  # "daily", "weekly", "monthly"
    data: List[TrendDataPoint]


class DepartmentAnalytics(BaseModel):
    code: str
    name: str
    icon: Optional[str] = None
    total_assigned: int
    resolved: int
    in_progress: int
    overdue: int
    sla_hours: int
    avg_resolution_hours: float
    sla_compliance_percent: float
    csat_score: float
    workload_index: float  # 0 to 100
    active_staff_count: int = 0


class WardAnalytics(BaseModel):
    ward_id: int
    ward_number: int
    ward_name: str
    zone: str
    total_issues: int
    resolved_issues: int
    active_issues: int
    critical_issues: int
    risk_index: float  # 0 to 100
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    hotspots_count: int
    resolution_rate_percent: float
    population_density: str
    top_issue_category: str


class CategoryAnalytics(BaseModel):
    category: str
    category_name: str
    count: int
    percentage: float
    resolved_count: int
    avg_resolution_hours: float
    ai_confidence_avg: float
    severity_distribution: Dict[str, int] = Field(default_factory=dict)
    subcategories: List[Dict[str, Any]] = Field(default_factory=list)


class SLAComplianceResponse(BaseModel):
    overall_compliance_percent: float
    on_time_resolutions: int
    delayed_resolutions: int
    critical_overdue: int
    escalated_count: int
    avg_first_response_hours: float
    department_breakdown: List[Dict[str, Any]] = Field(default_factory=list)


class AIInsightItem(BaseModel):
    id: str
    type: str  # "PREDICTION", "BOTTLENECK", "OPTIMIZATION", "ANOMALY"
    severity: str  # "CRITICAL", "WARNING", "INFO", "SUCCESS"
    title: str
    description: str
    impact_metric: str
    confidence_score: float
    recommended_action: str
    affected_ward_or_dept: str
    timestamp: str


class AIInsightsResponse(BaseModel):
    generated_at: str
    insights: List[AIInsightItem]
