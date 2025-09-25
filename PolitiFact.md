
---


```markdown
# PolitiFact API (maybe)

## Overview
PolitiFact is a well-known fact-checking organization. While there is no official public API, developers have created **unofficial endpoints** that can be used to fetch claims.

Since it’s a maybe, there’s no guarantee of stability or long-term support. (We will have to further look into it as we move forward)

## Example Endpoint
https://api.politifact.com/factchecks?format=json&limit=5


## Example Response
```json
[
  {
    "statement": "The economy added 200,000 jobs last month.",
    "speaker": "President",
    "rating": "Mostly True",
    "source_url": "https://www.politifact.com/factchecks/2025/jan/01/example"
  }
]

