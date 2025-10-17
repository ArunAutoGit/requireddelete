from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PrintLabel(BaseModel):
    sequence: int
    zpl_code: str
    unique_num: str

class PrintJobRequest(BaseModel):
    batch_id: int
    printer_type: str  # 'zpl', 'epl', 'pdf'
    labels: List[PrintLabel]

class PrintJobResponse(BaseModel):
    status: str
    message: str
    result: dict

class PrinterStatus(BaseModel):
    printer_type: str
    is_online: bool
    ip_address: Optional[str] = None
    last_check: datetime