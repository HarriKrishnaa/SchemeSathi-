# AWS Lambda backend

Handler: `lambda_function.lambda_handler`
Runtime: Python 3.12 (Python 3.11 also works)
Environment variables:
- `TABLE_NAME=SchemesathiScheme`
- `AWS_REGION=us-east-1`

Attach an execution role with `dynamodb:Scan` permission on the selected table. For a production deployment, use least-privilege permissions and avoid exposing personal data. Create an API Gateway `GET /Schemes` route integrated with this Lambda. Enable CORS for the GitHub Pages origin (or `*` for a classroom demo). Do not upload credentials.
