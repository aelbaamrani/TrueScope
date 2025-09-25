# API Integration Plan

## Workflow in App
1. User pastes or types a claim into the input box.
2. The app first queries **Google Fact Check Tools API**.
3. If no results are found, the app queries **PolitiFact API**.
4. Display results with:
   - Claim text
   - Source name (e.g., FactCheck.org, PolitiFact)
   - Rating (True, False, Mostly True, etc.)
   - Link to full article

## Example Flow
- User input: *"Vaccines cause autism"*
- Google API → Returns "False" (FactCheck.org).
- App displays result + link.

If Google API = no result:
- PolitiFact fallback → Show if available.
