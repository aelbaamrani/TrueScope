# APIs Overview
Our app uses external fact-check APIs to verify claims.  
Main APIs:
- Google Fact Check Tools
- PolitiFact (maybe)
- News API (maybe)

# APIs & Resources Documentation

## Google Fact Check Tools API
- Endpoint: `https://factchecktools.googleapis.com/v1alpha1/claims:search`
- Input: `query` (string), e.g. "The earth is flat"
- Output: JSON with claim text, publisher, rating
- Notes: Requires Google Cloud API key

Example response:
{
  "claims": [
    {
      "text": "The earth is flat",
      "claimReview": [
        {
          "publisher": { "name": "Snopes" },
          "textualRating": "False"
        }
      ]
    }
  ]
}
