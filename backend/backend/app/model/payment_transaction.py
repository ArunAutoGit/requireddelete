from sqlalchemy import Column, Integer, String, Numeric, Text, TIMESTAMP, ForeignKey
from app.core.database import Base

class PaymentTransaction(Base):
    __tablename__ = "payment_transaction"

    txn_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("scansession.session_id"))
    payee_id = Column(Integer)
    payee_role = Column(String(50))
    amount = Column(Numeric(10, 2))
    txn_number = Column(String(50))
    txn_date = Column(TIMESTAMP)
    status = Column(String(50))
    remarks = Column(Text)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
