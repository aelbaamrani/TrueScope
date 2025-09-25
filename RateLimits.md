
---
```markdown
# API Rate Limits & Reliability

## Google Fact Check Tools
- Free tier: 100 queries/day.
- Paid tier: Scales with Google Cloud billing.
- Requires API Key.
- High reliability.

## PolitiFact (maybe)
- No official documentation on limits.
- Can break or change without warning.
- Use as a **backup** source when Google Fact Check has no results.

## General Strategy
- Cache frequent queries (e.g., if multiple users check the same claim).
- If both APIs fail, display a message:  
  *“Fact-check sources unavailable. Please try again later.”*
