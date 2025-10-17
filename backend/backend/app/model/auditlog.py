from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "auditlog"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usermaster.user_id"))
    action = Column(String(255))
    entity_name = Column(String(100))
    entity_id = Column(Integer)
    description = Column(Text)
    timestamp = Column(TIMESTAMP)
