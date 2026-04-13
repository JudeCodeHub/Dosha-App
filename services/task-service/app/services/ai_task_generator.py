import os
import json
import logging
from datetime import date

logger = logging.getLogger(__name__)


def generate_ai_tasks(
    category: str,
    vata: float,
    pitta: float,
    kapha: float,
) -> list[str]:
    """
    Calls Google Gemini to generate 5 personalized Ayurvedic daily tasks.

    Args:
        category: One of 'diet', 'yoga', 'routine'
        vata:     Vata dosha percentage (0–100)
        pitta:    Pitta dosha percentage (0–100)
        kapha:    Kapha dosha percentage (0–100)

    Returns:
        A list of exactly 5 task strings, or [] if generation fails
        (caller should fall back to static templates on empty list).
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        logger.warning("GEMINI_API_KEY not set")
        return []

    # Identify dominant dosha for contextual guidance
    dosha_scores = {"Vata": vata, "Pitta": pitta, "Kapha": kapha}
    dominant = max(dosha_scores, key=dosha_scores.get)

    today_str = date.today().strftime("%A, %B %d")  # e.g. "Monday, April 14"

    category_context = {
        "diet": "food choices, eating habits, and nutrition practices",
        "yoga": "yoga poses, breathing exercises, and mindful movement",
        "routine": (
            "daily self-care habits, lifestyle rituals, and wellness "
            "routines"
        ),
    }.get(category, category)

    prompt = f"""You are a certified Ayurvedic wellness expert.

Today is {today_str}. Generate exactly 5 personalized daily tasks
for a user with the following dosha profile:
- Vata: {vata:.1f}%
- Pitta: {pitta:.1f}%
- Kapha: {kapha:.1f}%
- Dominant dosha: {dominant}
- Category: {category} ({category_context})

Rules:
1. Tasks must be directly related to {category_context}.
2. Weight tasks proportionally: about {vata:.0f}% Vata-balancing,
    {pitta:.0f}% Pitta-balancing, and {kapha:.0f}% Kapha-balancing.
3. Each task must be short, specific, and actionable
    (10 words or fewer).
4. Do not repeat generic advice. Be precise
    (e.g. "Drink warm cumin tea before breakfast").
5. Do NOT include numbering, bullet points, or explanations.
    Return only task text.

Return ONLY a valid JSON array of exactly 5 strings. Nothing else.
Example format:
["Task one here", "Task two here", "Task three here",
 "Task four here", "Task five here"]"""

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        configured_model = os.getenv("GEMINI_MODEL", "").strip()
        model_candidates = [
            configured_model,
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro-latest",
            "gemini-1.5-pro",
            "gemini-2.0-flash-exp",
            "gemini-2.0-flash",
        ]
        model_candidates = [m for m in dict.fromkeys(model_candidates) if m]

        raw_text = None
        last_error = None
        for model_name in model_candidates:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.8,
                        max_output_tokens=256,
                    ),
                )
                raw_text = (response.text or "").strip()
                if not raw_text:
                    raise ValueError("Empty response text")
                logger.info(
                    "Gemini generation succeeded with model=%s",
                    model_name,
                )
                break
            except Exception as model_error:
                last_error = model_error
                logger.warning(
                    "Gemini model %s failed: %s",
                    model_name,
                    model_error,
                )

        if raw_text is None:
            logger.error(
                "Gemini task generation failed for all models: %s",
                last_error,
            )
            return []

        # Strip markdown code fences if Gemini wraps the output
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        tasks = json.loads(raw_text)

        if not isinstance(tasks, list):
            raise ValueError("AI response is not a JSON array")

        # Clean and validate each task string
        tasks = [str(t).strip() for t in tasks if str(t).strip()]

        if len(tasks) < 3:
            raise ValueError(f"Too few tasks returned: {len(tasks)}")

        # Enforce exactly 5 (trim if AI returned more, pad if fewer)
        tasks = tasks[:5]

        logger.info(
            "Gemini generated %d tasks for category=%s dominant=%s",
            len(tasks), category, dominant
        )
        return tasks

    except json.JSONDecodeError as e:
        logger.error("Failed to parse Gemini JSON response: %s", e)
        return []
    except Exception as e:
        logger.error("Gemini task generation failed: %s", e)
        return []
