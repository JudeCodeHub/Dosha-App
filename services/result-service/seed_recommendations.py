"""
Seed script for the recommendations table.
Run once: python seed_recommendations.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal, Base
from app.models import Recommendation

# Create the table if it does not exist
Base.metadata.create_all(bind=engine)

seed_data = [
    {
        "dosha": "vata",
        "diet": (
            "Focus on warming, grounding foods to soothe the airy and variable nature of Vata.\n\n"
            "Favor cooked, mushy, and easily digestible meals like soups, stews, root vegetables, and warm oatmeal. "
            "Incorporate healthy fats such as ghee, sesame oil, and avocado to lubricate the system.\n\n"
            "Reduce cold, raw, crisp foods (like raw salads or crackers) and iced beverages, which can aggravate Vata "
            "and slow digestion. Eat at regular, consistent times to establish a grounding rhythm."
        ),
        "yoga": (
            "Prioritize gentle, grounding asanas to calm the nervous system and build stability.\n\n"
            "Move slowly and mindfully through poses, avoiding rapid or overly intense vinyasa sequences. "
            "Focus on standing poses (like Mountain or Tree) and restorative floor postures (like Child's Pose or seated forward folds).\n\n"
            "Keep the room comfortably warm and conclude every session with a long, extended Savasana to deeply settle scattered energy."
        ),
        "skincare": (
            "Vata skin tends to be dry, thin, and prone to early aging or flakiness, especially in cold weather.\n\n"
            "Emphasize deep hydration and nourishment. Use heavy, fat-rich moisturizers and rich oils like sesame, almond, or avocado oil rather than light lotions.\n\n"
            "Avoid harsh exfoliants or alcohol-based toners. Establish a daily self-massage (Abhyanga) ritual with warm oil before showering to protect the skin barrier."
        ),
        "haircare": (
            "Vata hair is often dry, brittle, and prone to split ends or a flaky, dry scalp.\n\n"
            "Wash your hair less frequently (1-2 times a week) using gentle, hydrating shampoos without harsh sulfates.\n\n"
            "Commit to a weekly warm oil scalp massage using sesame or castor oil to stimulate the follicles, deeply condition the roots, and anchor the nervous system."
        ),
        "herbs": (
            "Support Vata with calming, warming, and sweet-tending adaptogenic herbs.\n\n"
            "Ashwagandha is an excellent choice for stabilizing the nervous system, reducing anxiety, and improving sleep quality. "
            "Triphala is mild and excellent for regulating digestion.\n\n"
            "Sip on herbal teas made from ginger, cinnamon, cardamom, and fennel throughout the day to keep the digestive fire (Agni) steady."
        ),
        "routine": (
            "Consistency is the most powerful medicine for Vata's naturally erratic tendencies.\n\n"
            "Aim to wake up and go to sleep at the exact same time every day. Create a quiet, unhurried morning routine rather than rushing out the door.\n\n"
            "Protect your energy in the late afternoon (2 PM - 6 PM) when Vata naturally peaks by scheduling lighter tasks or taking a brief, mindful pause."
        ),
    },
    {
        "dosha": "pitta",
        "diet": (
            "Emphasize cooling, refreshing, and moderately heavy foods to balance Pitta's intense internal heat.\n\n"
            "Favor sweet, bitter, and astringent tastes found in sweet fruits, leafy greens, cucumber, coconut, and cooling grains like basmati rice or barley.\n\n"
            "Strictly avoid spicy, overly salty, deep-fried, and highly acidic foods (like tomatoes, vinegar, and heavy citrus). "
            "Minimize caffeine and alcohol, as both act like throwing gasoline on Pitta's fire."
        ),
        "yoga": (
            "Engage in relaxed, fluid, and cooling yoga flows to release trapped heat and tension without overexertion.\n\n"
            "Avoid aggressive hot yoga or intensely competitive practices. Focus on poses that open the chest and stretch the abdomen, "
            "such as mild backbends (Cobra, Bow) and cooling inversions (Shoulder Stand) or forward folds.\n\n"
            "Incorporate cooling breathwork (Sheetali Pranayama) and ensure you never push yourself to the point of exhaustion or frustration."
        ),
        "skincare": (
            "Pitta skin is typically fair, sensitive, easily flushed, and prone to inflammation, rashes, or acne breakouts.\n\n"
            "Use gentle, cooling ingredients like aloe vera, cucumber, rose water, and sandalwood to soothe inflammation.\n\n"
            "Avoid synthetic, chemical-heavy products, artificial fragrances, and intense direct sunlight, which instantly aggravate Pitta. "
            "Coconut oil or sunflower oil are excellent light moisturizers."
        ),
        "haircare": (
            "Pitta hair tends to be fine, straight, and is the most susceptible to early thinning or premature graying caused by excess heat in the head.\n\n"
            "Massage your scalp with cooling oils like coconut, amla, or bhringraj oil to draw heat away from the follicles and nourish the roots.\n\n"
            "Wash with gentle, natural shampoos and avoid excessive blow-drying or tight hairstyles that stress the scalp."
        ),
        "herbs": (
            "Rely on cooling, bitter, and soothing herbal solutions to clear excess heat from the blood and liver.\n\n"
            "Brahmi (Gotu Kola) is legendary for cooling a sharp, overactive mind. Shatavari is an excellent cooling tonic for systemic rejuvenation.\n\n"
            "Drink teas made from mint, licorice, coriander, or rose petals to naturally pacify the digestive tract."
        ),
        "routine": (
            "Balance Pitta's intense drive by intentionally scheduling periods of pure relaxation and unstructured play.\n\n"
            "Avoid working late into the night; aim to be asleep by 10 PM before the 'Pitta time' of night (10 PM - 2 AM) kicks in and causes a second wind of hyper-focus.\n\n"
            "Spend time in nature, particularly near water or walking in the moonlight, to naturally cool and calm your ambitious disposition."
        ),
    },
    {
        "dosha": "kapha",
        "diet": (
            "Prioritize light, warm, and energizing foods to stimulate Kapha's naturally slow and steady digestion.\n\n"
            "Favor bitter, pungent, and astringent tastes. Focus on steamed vegetables, light grains like quinoa or millet, "
            "and plenty of warming spices (black pepper, ginger, cayenne, garlic).\n\n"
            "Strictly reduce heavy, oily, cold, and sweet foods, including dairy, deep-fried items, and iced drinks, "
            "which increase Kapha's tendency toward sluggishness and congestion."
        ),
        "yoga": (
            "Engage in vigorous, stimulating, and heat-building asanas to counter Kapha's tendency toward stagnation.\n\n"
            "Fast-paced Vinyasa flows, Sun Salutations (Surya Namaskar), and strong standing poses (Warrior series) are excellent "
            "for breaking a sweat and moving lymphatic fluid.\n\n"
            "Push yourself to move briskly and breathe deeply (using Ujjayi breath) to clear out heaviness and lethargy."
        ),
        "skincare": (
            "Kapha skin is generally thick, smooth, and well-aging, but prone to excess oiliness, enlarged pores, or cystic congestion.\n\n"
            "Use invigorating, light, and clarifying routines. Regular gentle exfoliation using dry brushing (Garshana) or clay-based masks "
            "helps clear impurities and stimulate circulation.\n\n"
            "Avoid heavy, thick creams. Light oils like grapeseed, mustard, or safflower are much better suited if moisture is needed."
        ),
        "haircare": (
            "Kapha hair is typically thick, lustrous, and wavy, but the scalp can be prone to excessive oiliness or heavy dandruff.\n\n"
            "Wash your hair regularly with clarifying, natural shampoos to clear sebum buildup.\n\n"
            "If performing a scalp massage, use light, warming oils like mustard or almond, and consider adding a drop of stimulating "
            "essential oil like rosemary or eucalyptus to invigorate the roots."
        ),
        "herbs": (
            "Support Kapha with stimulating, warming, and expectorant herbal solutions to ignite vitality.\n\n"
            "Ginger, cinnamon, and black pepper (Trikatu) are exceptional for kindling the digestive fire. "
            "Tulsi (Holy Basil) helps clear the respiratory tract and lifts the mood.\n\n"
            "Drink hot ginger tea with a small spoon of raw honey throughout the day to melt away internal dampness."
        ),
        "routine": (
            "Kapha benefits immeasurably from an active, spontaneous, and stimulating daily rhythm.\n\n"
            "Wake up early — ideally before 6 AM, during the 'Vata time' of the morning — to harness lightness before the "
            "heavy Kapha period (6 AM - 10 AM) sets in.\n\n"
            "Avoid daytime napping at all costs. Intentionally switch up your routine, try new activities, and embrace "
            "physical challenges to prevent falling into a rut."
        ),
    },
]

db = SessionLocal()
try:
    for row in seed_data:
        existing = db.query(Recommendation).filter(Recommendation.dosha == row["dosha"]).first()
        if existing:
            # Update existing row so re-running the seed is safe
            for key, value in row.items():
                setattr(existing, key, value)
            print(f"Updated existing row for dosha: {row['dosha']}")
        else:
            db.add(Recommendation(**row))
            print(f"Inserted new row for dosha: {row['dosha']}")
    db.commit()
    print("Seed completed successfully.")
finally:
    db.close()
