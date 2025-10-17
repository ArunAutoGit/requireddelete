from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.core.database import Base

class ApprovalLog(Base):
    __tablename__ = "approvallog"

    approval_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("scansession.session_id"))
    approver_id = Column(Integer)
    approver_role = Column(String(50))
    action = Column(String(50))
    remarks = Column(Text)
    timestamp = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
