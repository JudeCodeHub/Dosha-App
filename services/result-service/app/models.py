from sqlalchemy import Column, Integer, Text
from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    dosha = Column(Text, unique=True, nullable=False, index=True)
    diet = Column(Text, nullable=True)
    yoga = Column(Text, nullable=True)
    skincare = Column(Text, nullable=True)
    haircare = Column(Text, nullable=True)
    herbs = Column(Text, nullable=True)
    routine = Column(Text, nullable=True)
