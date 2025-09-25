# Google Fact Check Tools API
- Base URL: `https://factchecktools.googleapis.com/v1alpha1/claims:search`
- Auth: Requires API key
- Example Request:
GET https://factchecktools.googleapis.com/v1alpha1/claims:search?query=climate+change&key=API_KEY

- Example Response:
```json
{
  "claims": [
    {
      "text": "Climate change is a hoax",
      "claimReview": [
        {
          "publisher": { "name": "FactCheck.org" },
          "textualRating": "False"
        }
      ]
    }
  ]
}
