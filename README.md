# SchemeSathi — Government Scheme Finder

A static HTML/CSS/JavaScript frontend that retrieves scheme records from an AWS API Gateway endpoint backed by AWS Lambda and DynamoDB. Designed for GitHub Pages and AWS Learner Lab evaluation.

## 🚀 Live Demo / Output
Since it is Learners Lab AWS Project the module has to be started before launch the live website

Check the live application output hosted on AWS S3:
👉 **[View Live Demo on AWS S3](https://schemesathi-web-2026-hk.s3.us-east-1.amazonaws.com/SchemeSathi.html)**

---

## Project structure

```text
SchemeSathi_GitHub_Project/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── lambda_function.py
│   ├── requirements.txt
│   └── README.md
├── data/
│   └── schemes.json
├── docs/
│   └── architecture.md
├── .gitignore
└── README.md
```

## Frontend features

- Keyword search and state filtering
- Dynamic category chips, including Solar & Renewable Energy, Agriculture & Farmers, Fisheries & Livestock, Education & Scholarships, Women & Child Welfare, Healthcare & Insurance, Housing & Shelter, Employment & Skill Development, Business & Entrepreneurship, Loans & Financial Assistance, Pensions & Social Security, Food & Nutrition, Energy & Environment, Water & Sanitation, Transport & Mobility, Digital & Public Services, Community & Inclusion, Disaster Relief & Assistance, Rural & Urban Development, Sports/Arts/Culture, Tax & Benefits, Legal Aid, and fallback categories
- English, Tamil, and Hindi browser voice search (browser support/permissions required)
- Save schemes locally, dark mode, sorting, copy details, and read-aloud
- Official website links and eligibility/benefit details when present in the API data

## Deploy the frontend to GitHub Pages (Optional)

1. In your repository, if deploying via GitHub Pages, configure Pages under **Settings → Pages**.
2. Select the `main` branch (either root or `/frontend` folder depending on your setup).
3. Visit `https://harrikrishnaa.github.io/SchemeSathi-/` once published.

The frontend currently points to the configured demo API endpoint in `frontend/script.js`. If you create a new API, update `API_URL` there.

## AWS backend setup

1. In AWS Learner Lab, select `us-east-1` (or change `AWS_REGION`).
2. Create/choose a DynamoDB table. The current demo table is `SchemesathiScheme`, with partition key `SchemeID`.
3. Create a Lambda function using Python 3.12 and upload `backend/lambda_function.py`; set handler to `lambda_function.lambda_handler`.
4. Set environment variables `TABLE_NAME=SchemesathiScheme` and `AWS_REGION=us-east-1`.
5. Ensure the Lambda execution role can perform `dynamodb:Scan` on that table.
6. Create an API Gateway HTTP API route `GET /Schemes`, integrate the Lambda, deploy a stage, and enable CORS for your frontend origin.
7. Test the endpoint. It should return a JSON array of scheme objects.

## Data file

`data/schemes.json` is a starter/export dataset converted from the CSV available during project packaging. It contains 15 sample records and is **not a dump of all 95 records currently in DynamoDB**. The live frontend uses the API response, not this local file. Review each official URL, eligibility and benefit description against current government guidance before real-world use.

## Important notes

- The category labels are assigned in the browser from keywords in the returned record. Category grouping does not verify scheme eligibility or guarantee the scheme is currently open.
- Never commit AWS access keys, session tokens, passwords, `.env` files, or Learner Lab credentials.
- DynamoDB `Scan` is fine for a small demo. For a larger production catalogue, consider indexes, pagination/caching, and server-side filtering.
- This is an educational project, not an official government service. Users should confirm details on official portals.
