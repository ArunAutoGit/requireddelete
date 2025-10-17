from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    # Removed user_id from here

class TokenData(BaseModel):
    user_id: Optional[str] = None  # Now user_id comes from sub
    role: Optional[str] = None