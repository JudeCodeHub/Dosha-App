import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found")

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("Adding columns to 'users' table...")
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN vata_score INTEGER;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN pitta_score INTEGER;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN kapha_score INTEGER;"))
        conn.commit()
        print("Success! Columns added.")
    except Exception as e:
        print("Error or columns may already exist:", e)
