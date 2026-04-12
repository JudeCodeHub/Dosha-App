from fastapi import APIRouter
from app.schemas.quiz import QuizSubmission, QuizResultResponse

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/calculate-result", response_model=QuizResultResponse)
def calculate_result(submission: QuizSubmission):
    """Calculates the Dosha percentages based on quiz answers."""
    counts = {"Vata": 0, "Pitta": 0, "Kapha": 0}

    for answer in submission.answers:
        counts[answer.dosha] += 1

    total = len(submission.answers)

    if total == 0:
        return {
            "counts": counts,
            "percentages": {"Vata": 0, "Pitta": 0, "Kapha": 0},
            "dominant_dosha": None,
        }

    percentages = {
        "Vata": round((counts["Vata"] / total) * 100, 2),
        "Pitta": round((counts["Pitta"] / total) * 100, 2),
        "Kapha": round((counts["Kapha"] / total) * 100, 2),
    }

    dominant_dosha = max(counts, key=counts.get)

    return {
        "counts": counts,
        "percentages": percentages,
        "dominant_dosha": dominant_dosha,
    }
