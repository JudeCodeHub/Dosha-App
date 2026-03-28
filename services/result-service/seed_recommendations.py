"""
Seed script for the recommendations table.
Run once: python seed_recommendations.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal, Base
from app.models import Recommendation

# Drop the table and recreate it to safely apply schema constraint changes
Base.metadata.drop_all(bind=engine, tables=[Recommendation.__table__])
Base.metadata.create_all(bind=engine)

seed_data = [
    {
        "dosha": "vata",
        "language": "en",
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
        "language": "en",
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
        "language": "en",
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
    {
        "dosha": "vata",
        "language": "ta",
        "diet": "வாதத்தின் மாறுபடும் தன்மையை அமைதிப்படுத்த சூடான மற்றும் சத்தான உணவுகளில் கவனம் செலுத்துங்கள்.\n\nசூப்கள், மென்மையான காய்கறிகள் மற்றும் ஓட்ஸ் போன்ற எளிதில் செரிக்கக்கூடிய உணவுகளைத் தேர்ந்தெடுக்கவும். ஆரோக்கியமான கொழுப்புகளான நெய் மற்றும் நல்லெண்ணெய் சேர்க்கவும்.\n\nகுளிர்ந்த, வறுத்த உணவுகள் மற்றும் குளிர்ந்த பானங்களை குறைக்கவும். நேரத்திற்கு சாப்பிடப் பழகவும்.",
        "yoga": "நரம்பு மண்டலத்தை அமைதிப்படுத்த மென்மையான மற்றும் உறுதியான ஆசனங்களுக்கு முன்னுரிமை கொடுங்கள்.\n\nமெதுவாக மூச்சுப் பயிற்சி செய்து, கடினமான உடற்பயிற்சிகளைத் தவிர்க்கவும். நின்றுகொண்டு செய்யும் ஆசனங்களில் கவனம் செலுத்துங்கள்.\n\nஅறையை சற்று வெதுவெதுப்பாக வைத்துக்கொண்டு, நீண்ட ஓய்வுடன் (சவாசனம்) முடித்துக்கொள்ளவும்.",
        "skincare": "வாத சருமம் வறண்டு, எளிதில் சுருக்கங்கள் வரக்கூடியதாக இருக்கும்.\n\nசருமத்திற்கு நல்ல ஈரப்பதம் அளிக்கவும். லேசான லோஷன்களுக்குப் பதிலாக நல்லெண்ணெய் அல்லது பாதாம் எண்ணெய் போன்ற தடிமனான எண்ணெய்களைப் பயன்படுத்தவும்.\n\nகுளிப்பதற்கு முன் வெதுவெதுப்பான எண்ணெயில் மசாஜ் செய்வது சருமத்தைப் பாதுகாக்க உதவும்.",
        "haircare": "வாத முடி பெரும்பாலும் வறண்டு, எளிதில் உடையக்கூடியதாக இருக்கும்.\n\nவாரத்திற்கு 1 அல்லது 2 முறை மட்டுமே ரசாயனம் குறைந்த ஷாம்பு கொண்டு தலைமுடியைக் கழுவவும்.\n\nவாரம் ஒருமுறை வெதுவெதுப்பான நல்லெண்ணெய் அல்லது விளக்கெண்ணெய் கொண்டு தலைக்கு மசாஜ் செய்யவும்.",
        "herbs": "வாதத்தைச் சரிசெய்ய அமைதியூட்டும் மற்றும் சூடான மூலிகைகளைப் பயன்படுத்தவும்.\n\nஅஸ்வகந்தா நரம்புகளை அமைதிப்படுத்தவும், தூக்கத்தை மேம்படுத்தவும் சிறந்தது. செரிமானத்தை முறைப்படுத்த திரிபலா மிகவும் நல்லது.\n\nஇஞ்சி, லவங்கப்பட்டை மற்றும் ஏலக்காய் சேர்ந்த தேநீரை நாள் முழுவதும் அளவாக அருந்தவும்.",
        "routine": "வாதத்திற்கு நிலையான பழக்கவழக்கங்கள் மிக முக்கியம்.\n\nதினமும் ஒரே நேரத்தில் தூங்கி எழப் பழகுங்கள். காலை நேரத்தை நிதானமாகத் தொடங்குங்கள்.\n\nபிற்பகலில் அதிக வேலை செய்வதைத் தவிர்த்து, சற்று ஓய்வெடுக்க நேரம் ஒதுக்கவும்."
    },
    {
        "dosha": "pitta",
        "language": "ta",
        "diet": "பித்தத்தின் உடல் சூட்டைத் தணிக்க குளிர்ச்சியான மற்றும் சத்தான உணவுகளுக்கு முன்னுரிமை கொடுங்கள்.\n\nஇனிப்பு, கசப்பு மற்றும் துவர்ப்பு சுவையுள்ள பழங்கள், பச்சை காய்கறிகள், இளநீர் மற்றும் பார்லி போன்ற உணவுகளைச் சாப்பிடுங்கள்.\n\nகாரம், அதிக உப்பு, அதிக புளிப்பு மற்றும் வறுத்த உணவுகளைத் தவிர்க்கவும். காபி மற்றும் மதுப் பழக்கத்தைக் கைவிடுங்கள்.",
        "yoga": "உடல் சூட்டைக் குறைக்கும் மென்மையான யோகா பயிற்சிகளைச் செய்யவும்.\n\nஅதிக வியர்வை மற்றும் சோர்வைத் தரும் கடுமையான பயிற்சிகளைத் தவிர்க்கவும். நெஞ்சை விரித்துச் செய்யும் ஆசனங்கள் நல்லது.\n\nமூச்சை சீராக்கும் பயிற்சிகளை (சீதளி பிராணாயாமம்) செய்து மனதை அமைதிப்படுத்துங்கள்.",
        "skincare": "பித்த சருமம் மென்மையாக இருக்கும், எளிதில் சிவந்து அலர்ஜி ஏற்பட வாய்ப்புள்ளது.\n\nகற்றாழை, வெள்ளரி துண்டுகள் மற்றும் ரோஸ் வாட்டர் போன்ற குளிர்ச்சியான பொருட்களைப் பயன்படுத்தவும்.\n\nரசாயனப் பொருட்கள் மற்றும் அதிக வெயிலைத் தவிர்க்கவும். தேங்காய் எண்ணெய் சருமத்திற்கு மிகவும் நல்லது.",
        "haircare": "பித்த முடி மெல்லியதாக இருக்கும்; அதிக உடல் வெப்பத்தால் முடி உதிர்தல் அல்லது இளநரை வர வாய்ப்புள்ளது.\n\nதேங்காய் எண்ணெய், நெல்லிக்காய் அல்லது கரிசலாங்கண்ணி எண்ணெயால் தலைக்கு மசாஜ் செய்வது சூட்டைக் குறைக்கும்.\n\nமென்மையான ஷாம்பு பயன்படுத்தவும்; ஹேர் டிரையர் பயன்படுத்துவதைத் தவிர்க்கவும்.",
        "herbs": "பித்தத்தின் சீற்றத்தைக் குறைக்க கசப்பான மற்றும் குளிர்ச்சியான மூலிகைகளைப் பயன்படுத்துங்கள்.\n\nபிராமி (வல்லாரை) மனதை அமைதிப்படுத்த சிறந்த மூலிகையாகும். சதாவரி உடல் சூட்டைக் குறைக்கும்.\n\nபுதினா, அதிமதுரம் அல்லது ரோஜா இதழ்கள் கலந்த தேநீரை அருந்துங்கள்.",
        "routine": "பித்த ஆதிக்கம் உள்ளவர்கள் வேலைகளுக்கு இடையே போதுமான ஓய்வு எடுக்க வேண்டும்.\n\nஇரவில் வெகுநேரம் கண் விழித்து வேலை செய்வதைத் தவிர்த்து, இரவு 10 மணிக்கே தூங்கச் செல்லுங்கள்.\n\nஇயற்கையுடன் நேரம் செலவிடுங்கள்; குறிப்பாக நிலவொளியில் நடப்பது மனதையும் உடலையும் குளிரச்செய்யும்."
    },
    {
        "dosha": "kapha",
        "language": "ta",
        "diet": "கபத்தின் மந்தமான சீரண சக்தியைத் தூண்ட இலகுவான மற்றும் சூடான உணவுகளுக்கு முன்னுரிமை கொடுங்கள்.\n\nகசப்பு மற்றும் காரமான சுவைகளைத் தேர்ந்தெடுக்கவும். ஆவியில் வேகவைத்த காய்கறிகள் மற்றும் இஞ்சி, பூண்டு, மிளகு போன்றவற்றை உணவில் சேர்க்கவும்.\n\nபால் பொருட்கள், இனிப்பு, குளிர்ந்த பானங்கள் மற்றும் எண்ணெய் பலகாரங்களைக் கட்டாயம் தவிர்க்க வேண்டும்.",
        "yoga": "உடலில் உள்ள மந்தத்தன்மையை நீக்க சுறுசுறுப்பான உடற்பயிற்சிகளைச் செய்ய வேண்டும்.\n\nசூர்ய நமஸ்காரம் மற்றும் வேகமான ஆசனங்கள் வியர்வையை வெளியேற்ற மிகவும் உதவும்.\n\nगழ்ந்த மூச்சுப் பயிற்சிகள் மூலம் (உஜ்ஜாயி) நுரையீரலைச் சுத்தமாக வைத்துக்கொள்ளுங்கள்.",
        "skincare": "கப சருமம் தடிமனாக, எண்ணெய் பசையுடன் மற்றும் வழவழப்பாக இருக்கும். பற்கள் அல்லது பருக்கள் எளிதில் தோன்றலாம்.\n\nசருமத்தை உற்சாகப்படுத்தும் பயிற்சிகளைச் செய்யவும். வறண்ட தூரிகை கொண்டு தேய்ப்பது (கார்சனா) அல்லது களிமண் பூச்சு பயன்படுத்துவது நல்லது.\n\nஅதிக ஈரப்பதம் தரும் க்ரீம்களைத் தவிர்த்து, கடுகு அல்லது திராட்சை விதை எண்ணெய் போன்ற இலகுவான எண்ணெய்களைப் பயன்படுத்தவும்.",
        "haircare": "கப முடி தடிமனாகவும், அடர்த்தியாகவும் இருக்கும், ஆனால் தலையில் அதிக எண்ணெய் மற்றும் பொடுகு ஏற்பட வாய்ப்புள்ளது.\n\nஇயற்கையான முறையில் சீயக்காய் அல்லது மூலிகை ஷாம்பு கொண்டு தலைமுடியை சீராகக் கழுவவும்.\n\nதேவைப்பட்டால் வெதுவெதுப்பான கடுகு எண்ணெயில் சிறிது யூகலிப்டஸ் அல்லது ரோஸ்மேரி கலந்து மசாஜ் செய்யலாம்.",
        "herbs": "கபத்தின் மந்தத்தைக் குறைக்க உடலுக்கு வெப்பம் தரும் மற்றும் சளியை அகற்றும் மூலிகைகளைப் பயன்படுத்தவும்.\n\nஇஞ்சி, மிளகு மற்றும் திப்பிலி (திரிகடுகு) செரிமான நெருப்பைத் தூண்டும். துளசி சளியை அகற்றி புத்துணர்ச்சி தரும்.\n\nநாள் முழுவதும் சூடான இஞ்சி தேநீரில் சிறிதளவு தேன் கலந்து அருந்துவது நல்லது.",
        "routine": "கப ஆதிக்கம் உள்ளவர்கள் சுறுசுறுப்பான மற்றும் மாற்றங்கள் நிறைந்த வாழ்க்கை முறையைப் பின்பற்ற வேண்டும்.\n\nகாலை 6 மணிக்கு முன்பாகவே எழுந்து வேலையைத் தொடங்குவது மிகவும் நல்லது.\n\nபகலில் தூங்குவதைக் கட்டாயம் தவிர்க்க வேண்டும்; எப்போதும் புதிய காரியங்களில் ஈடுபட்டு சுறுசுறுப்பாக இருக்க வேண்டும்."
    }
]

db = SessionLocal()
try:
    for row in seed_data:
        existing = db.query(Recommendation).filter(
            Recommendation.dosha == row["dosha"],
            Recommendation.language == row["language"]
        ).first()
        
        if existing:
            # Update existing row so re-running the seed is safe
            for key, value in row.items():
                setattr(existing, key, value)
            print(f"Updated existing row for dosha: {row['dosha']} (Lang: {row['language']})")
        else:
            db.add(Recommendation(**row))
            print(f"Inserted new row for dosha: {row['dosha']} (Lang: {row['language']})")
    db.commit()
    print("Seed completed successfully.")
finally:
    db.close()
