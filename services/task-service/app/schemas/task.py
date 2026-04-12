from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class TaskBase(BaseModel):
    task_name: str
    category: str
    completed: bool
    date: date


class TaskRead(TaskBase):
    id: int

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    completed: bool


class TaskGenerateRequest(BaseModel):
    vata: float
    pitta: float
    kapha: float
