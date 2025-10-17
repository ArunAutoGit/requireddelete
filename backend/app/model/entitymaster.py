from sqlalchemy import Column, Integer, String, Text, Numeric, TIMESTAMP
from app.core.database import Base

class EntityMaster(Base):
    __tablename__ = "entitymaster"

    entity_id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50))
    entity_name = Column(String(150))
    customer_name = Column(String(150))
    location = Column(String(150))
    segment = Column(String(100))
    address = Column(Text)
    contact_number = Column(String(15))
    email = Column(String(150))
    remarks = Column(Text)
    geo_lat = Column(Numeric(10, 6))
    geo_long = Column(Numeric(10, 6))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
    created_by = Column(Integer)
    updated_by = Column(Integer)
