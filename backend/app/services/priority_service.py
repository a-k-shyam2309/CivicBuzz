"""
CivicBuzz Priority Scoring Engine
Calculates multi-factor priority score (0-100) with transparent explainable reasons.
"""

from typing import Any, Dict, List, Tuple


def calculate_priority_score(
    severity: str,
    cluster_count: int = 1,
    safety_risk_identified: bool = False,
    days_open: int = 0,
    category: str = "ROAD",
) -> Dict[str, Any]:
    """
    Computes priority score (0-100) and severity level with explainable reasons.
    """
    score = 0.0
    reasons = []

    # 1. Base Severity Score
    severity_upper = severity.upper()
    if severity_upper == "CRITICAL":
        score += 55.0
        reasons.append("Critical severity assessment (potential immediate danger to citizens)")
    elif severity_upper == "HIGH":
        score += 40.0
        reasons.append("High severity assessment (significant public disruption or hazard)")
    elif severity_upper == "MEDIUM":
        score += 25.0
        reasons.append("Medium severity assessment (community inconvenience)")
    else:
        score += 12.0
        reasons.append("Low severity assessment (routine maintenance)")

    # 2. Cluster / Multi-Citizen Weighting
    if cluster_count > 1:
        cluster_bonus = min(30.0, (cluster_count - 1) * 6.0)
        score += cluster_bonus
        reasons.append(f"{cluster_count} verified citizen reports clustered in this immediate vicinity")

    # 3. Safety Risk Flag from AI
    if safety_risk_identified:
        score += 15.0
        reasons.append("AI safety analysis identified active traffic/health risk")

    # 4. Aging / Unresolved Duration
    if days_open > 0:
        age_bonus = min(15.0, days_open * 2.5)
        score += age_bonus
        reasons.append(f"Issue unresolved for {days_open} day{'s' if days_open > 1 else ''}")

    # Clamp score to [0, 100]
    final_score = max(0.0, min(100.0, score))

    # Determine priority level
    if final_score >= 80.0:
        level = "CRITICAL"
    elif final_score >= 60.0:
        level = "HIGH"
    elif final_score >= 35.0:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "score": round(final_score, 1),
        "level": level,
        "reasons": reasons,
    }
