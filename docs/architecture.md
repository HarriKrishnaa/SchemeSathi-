# SchemeSathi architecture

```text
Browser (GitHub Pages)
  ├── index.html — page structure
  ├── style.css — responsive and dark-theme styles
  └── script.js — search, category classification, voice search and API client
            │ HTTPS GET /Schemes
            ▼
       Amazon API Gateway
            │ Lambda proxy integration
            ▼
       AWS Lambda (Python)
            │ DynamoDB Scan (paginated)
            ▼
       Amazon DynamoDB: SchemesathiScheme
```

The frontend performs filtering after loading the array. The Lambda returns a normalized JSON array. Configure CORS on API Gateway and Lambda response headers.
