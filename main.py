from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
API_KEY = os.getenv("GOOGLE_FACT_CHECK_API_KEY")

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request and response models
class FactCheckRequest(BaseModel):
    claim: str

class ClaimReview(BaseModel):
    publisher: str
    title: str
    url: str
    text: str
    rating: str

class FactCheckResponse(BaseModel):
    claim: str
    found: bool
    reviews: Optional[List[ClaimReview]]

@app.post("/fact-check", response_model=FactCheckResponse)
async def fact_check(request: FactCheckRequest):
    if not request.claim.strip():
        raise HTTPException(status_code=400, detail="Claim cannot be empty.")

    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        "query": request.claim,
        "key": API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error fetching from Google Fact Check API")

    data = response.json()
    claims = data.get("claims", [])

    if not claims:
        return FactCheckResponse(claim=request.claim, found=False, reviews=[])

    reviews = []
    for claim in claims:
        for review in claim.get("claimReview", []):
            reviews.append(ClaimReview(
                publisher=review.get("publisher", {}).get("name", "Unknown"),
                title=review.get("title", "No Title"),
                url=review.get("url", "#"),
                text=review.get("text", "No review text"),
                rating=review.get("text", "No rating")
            ))

    return FactCheckResponse(claim=request.claim, found=True, reviews=reviews)
