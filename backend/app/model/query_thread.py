from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.core.database import Base

class QueryThread(Base):
    __tablename__ = "query_thread"

    query_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("scansession.session_id"))
    raised_by = Column(Integer)
    responded_by = Column(Integer)
    query_text = Column(Text)
    response_text = Column(Text)
    status = Column(String(50))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
