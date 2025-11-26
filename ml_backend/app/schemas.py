from pydantic import BaseModel
from typing import List, Optional

class ConsentInput(BaseModel):
    website: str
    platform: str
    permission: str
    category: str
    purpose: str
    status: str
    dataFlow: List[str]
    retention_months: int
    grantedOn: str

class PredictionResponse(BaseModel):
    risk_score: float
    risk_category: str
