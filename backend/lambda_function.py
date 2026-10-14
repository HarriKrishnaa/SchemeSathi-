"""SchemeSathi AWS Lambda API.

Reads scheme records from DynamoDB and returns a JSON array through API Gateway.
Configure environment variables TABLE_NAME and AWS_REGION in the Lambda console.
Never put AWS credentials in this file or in the repository.
"""
import json
import os
import boto3
from boto3.dynamodb.conditions import Attr

TABLE_NAME = os.environ.get("TABLE_NAME", "SchemesathiScheme")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(TABLE_NAME)


def _normalise(item):
    """Preserve original fields while exposing consistent frontend field names."""
    out = dict(item)
    aliases = {
        "SchemeID": "scheme_id",
        "SchemeName": "scheme_name",
        "Category": "category",
        "State": "state_applicability",
        "ApplyURL": "official_url",
        "Benefits": "benefit_summary",
        "Eligibility": "eligibility_summary",
    }
    for old, new in aliases.items():
        if new not in out and old in out:
            out[new] = out[old]
    # Ensure category is present for records using older naming conventions.
    if not out.get("category"):
        out["category"] = "Other Schemes"
    return out


def lambda_handler(event, context):
    """GET /Schemes: return all records (DynamoDB pagination supported)."""
    try:
        items = []
        params = {}
        while True:
            response = table.scan(**params)
            items.extend(_normalise(x) for x in response.get("Items", []))
            last_key = response.get("LastEvaluatedKey")
            if not last_key:
                break
            params["ExclusiveStartKey"] = last_key
        items.sort(key=lambda x: str(x.get("scheme_name", x.get("SchemeName", ""))).casefold())
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
            },
            "body": json.dumps(items, ensure_ascii=False, default=str),
        }
    except Exception as exc:
        # Do not return internal credentials/configuration; log detail to CloudWatch instead.
        print("SchemeSathi DynamoDB scan failed:", repr(exc))
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
            },
            "body": json.dumps({"message": "Unable to load schemes. Check Lambda permissions and table configuration."}),
        }

