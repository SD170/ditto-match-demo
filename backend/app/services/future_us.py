from __future__ import annotations

from app.schemas import (
    BestDatePlan,
    ChemistryDimension,
    ConnectedSignal,
    ContextConfidence,
    FutureUsRequest,
    FutureUsResponse,
    FutureUsScenario,
)


def _contains(text: str, *needles: str) -> bool:
    lowered = text.lower()
    return any(needle in lowered for needle in needles)


def _persona_archetype(user_bio: str, match_bio: str) -> str:
    combined = f"{user_bio} {match_bio}".lower()
    if _contains(combined, "art", "museum", "design", "ux", "ceramic", "sketch"):
        return "The Soft-Launch Culture Explorers"
    if _contains(combined, "gym", "track", "hike", "run", "health", "strava"):
        return "The Momentum Builders"
    if _contains(combined, "food", "ramen", "dumpling", "cook", "bake", "coffee", "latte"):
        return "The Low-Key Taste Testers"
    return "The Slow-Burn Campus Explorers"


def build_future_us_simulation(req: FutureUsRequest) -> FutureUsResponse:
    """Return a deterministic demo simulation powered by synthetic opt-in context.

    This deliberately avoids claiming relationship prediction. The confidence score means
    context coverage: how much private, opt-in signal the simulated agents had.
    """

    match = req.match
    combined = f"{req.user_bio} {match.bio}"
    active = _contains(combined, "gym", "track", "hike", "run", "clinic", "volunteer")
    creative = _contains(combined, "art", "museum", "design", "ux", "sketch", "ceramic")
    food = _contains(combined, "food", "ramen", "dumpling", "cook", "bake", "coffee", "latte", "soup")

    location = "North Quad Night Market"
    if creative:
        location = "Campus Gallery + 24-hour Latte Bar"
    elif active:
        location = "Riverside Walk Loop + Dumpling Cart"
    elif food:
        location = "Tiny Ramen Counter off University Ave"

    connected_signals = [
        ConnectedSignal(
            source="ChatGPT Memory",
            status="Opt-in persona graph",
            confidence=91,
            insight="Detected humor style, overthinking pattern, preferred date pressure, and growth goals from synthetic memory notes.",
        ),
        ConnectedSignal(
            source="Google Maps",
            status="Shared routine overlap",
            confidence=84,
            insight=f"Found a low-friction overlap near {location} without exposing exact private routes to the match.",
        ),
        ConnectedSignal(
            source="Calendar",
            status="Energy-window match",
            confidence=78,
            insight="Both agents look more socially available midweek after obligations, not late-night doom-scroll hours.",
        ),
        ConnectedSignal(
            source="Spotify",
            status="Vibe resonance",
            confidence=73,
            insight="The agents share a novelty-seeking music pattern: familiar comfort first, one weird recommendation after trust builds.",
        ),
        ConnectedSignal(
            source="Food Orders",
            status="Date constraint compiler",
            confidence=86,
            insight="The first plan avoids high-commitment dinner energy and uses snackable comfort food as a conversation pressure valve.",
        ),
        ConnectedSignal(
            source="Messages Style",
            status="Repair signal",
            confidence=69,
            insight="One agent jokes when nervous; the other responds well when intent is named directly instead of left ambiguous.",
        ),
    ]

    chemistry_map = [
        ChemistryDimension(
            name="Rhythm Fit",
            score=86,
            signal="Midweek windows and similar reset rituals line up.",
            opportunity="Suggest a bounded 70-minute first date so neither person feels trapped or rushed.",
        ),
        ChemistryDimension(
            name="Emotional Safety",
            score=79,
            signal="Both agents prefer warmth plus competence over performative mystery.",
            opportunity="Lead with a tiny specific compliment; avoid making the first interaction feel like an interview.",
        ),
        ChemistryDimension(
            name="Novelty + Growth",
            score=88 if creative or active else 82,
            signal="There is enough difference to feel interesting without creating lifestyle whiplash.",
            opportunity="Use a date that gives them something to react to together, not just face-to-face evaluation.",
        ),
        ChemistryDimension(
            name="Conflict Repair",
            score=74,
            signal="A likely misread is delayed texting being interpreted as low interest.",
            opportunity="Normalize direct repair: ‘I go quiet when overloaded, not when I stop caring.’",
        ),
        ChemistryDimension(
            name="Intention Alignment",
            score=81,
            signal="Both appear curious about a real connection but allergic to forced seriousness too early.",
            opportunity="Frame the first meet as a vibe test, then let momentum earn depth.",
        ),
        ChemistryDimension(
            name="Practical Logistics",
            score=84,
            signal="Location, budget, and time constraints can be compiled into one doable plan.",
            opportunity="Pick a place with an easy exit, a second-stop option, and no reservation stress.",
        ),
    ]

    scenarios = [
        FutureUsScenario(
            title="Natural Overlap",
            timeframe="Next Wednesday · 7:10 PM",
            prompt="Where would your lives naturally cross without forcing it?",
            simulation=f"The agents converged on {location}: public, playful, and close enough to both routines that saying yes feels easy.",
            best_move="Send one specific invite with a built-in out: 70 minutes, snacks, then optional walk.",
            watchout="Do not over-optimize the plan so much that it feels scripted.",
        ),
        FutureUsScenario(
            title="First Misread",
            timeframe="After the second message",
            prompt="What tiny thing could create avoidable friction?",
            simulation="A dry joke could read as distance if it lands before enough warmth is established.",
            best_move="Pair the joke with one sincere sentence so the tone has an anchor.",
            watchout="Mystery is less attractive here than clarity with style.",
        ),
        FutureUsScenario(
            title="Repair Moment",
            timeframe="Week two",
            prompt="How would the pair recover from a small mismatch?",
            simulation="The strongest repair path is quick acknowledgement, a little humor, and a concrete next plan.",
            best_move="Say what happened, what you meant, and what you want to do next.",
            watchout="Do not let a logistics issue become a character judgment.",
        ),
        FutureUsScenario(
            title="Growth Arc",
            timeframe="30 days in",
            prompt="What could this connection unlock if it works?",
            simulation="This pair nudges each other toward showing up: more follow-through, more novelty, less hiding behind perfect timing.",
            best_move="Make one recurring micro-ritual: weekly new-place snack run or gallery lap.",
            watchout="Keep it light enough to stay fun while being intentional enough to feel chosen.",
        ),
    ]

    best_date = BestDatePlan(
        title="Compiled First Date: The 70-Minute Signal Test",
        location=location,
        suggested_time="Next Wednesday · 7:10 PM",
        plan=[
            "Meet outside so the start feels casual, not interview-coded.",
            "Grab one shareable snack or drink to create a tiny collaboration moment.",
            "Walk for 12 minutes with one playful prompt: ‘What hill would your friends say you die on?’",
            "End while energy is still rising; offer an optional second stop only if both lean in.",
        ],
        why_it_works="It uses relationship-specific signals — responsiveness, appreciation, rhythm, repair, and logistics — instead of pretending generic profile similarity can predict love.",
        invite_text=f"Want to test our Future Us simulation? {location}, Wednesday at 7:10 — 70 minutes, one snack, zero interview energy.",
    )

    return FutureUsResponse(
        title="Future Us",
        subtitle="Private agents simulated possible dynamics — not a prediction.",
        match_name=match.name,
        couple_thesis=_persona_archetype(req.user_bio, match.bio),
        confidence=ContextConfidence(
            score=82,
            label="High context confidence",
            explanation="Confidence means the agents had rich opt-in context. It is not a probability that the relationship succeeds.",
        ),
        connected_signals=connected_signals,
        chemistry_map=chemistry_map,
        scenarios=scenarios,
        best_date=best_date,
        privacy_note="Private simulation. Not a prediction. Your connected signals stay yours and are never shown to the match without consent.",
        research_note="Inspired by relationship science showing that relationship-specific experiences — responsiveness, appreciation, conflict, satisfaction, and commitment — matter more than generic trait matching.",
    )
