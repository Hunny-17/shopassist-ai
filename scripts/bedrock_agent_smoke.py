import argparse
import json
import os
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Smoke test the configured AWS Bedrock Agent runtime.")
    parser.add_argument("--message", default="Xin chao, goi y laptop gaming 20-25 trieu")
    parser.add_argument("--region", default=None)
    parser.add_argument("--agent-id", default=None)
    parser.add_argument("--agent-alias-id", default=None)
    return parser.parse_args()


def main() -> int:
    load_dotenv()
    load_dotenv(os.path.join("backend", ".env"))

    args = parse_args()
    region = args.region or os.getenv("AWS_REGION", "ap-southeast-1")
    agent_id = args.agent_id or os.getenv("BEDROCK_AGENT_ID")
    agent_alias_id = args.agent_alias_id or os.getenv("BEDROCK_AGENT_ALIAS_ID")

    if not agent_id or not agent_alias_id:
        print(json.dumps({
            "ok": False,
            "error": "missing_agent_config",
            "message": "Set BEDROCK_AGENT_ID and BEDROCK_AGENT_ALIAS_ID, or pass --agent-id/--agent-alias-id.",
        }, ensure_ascii=False, indent=2))
        return 2

    client = boto3.client("bedrock-agent-runtime", region_name=region)
    try:
        response = client.invoke_agent(
            agentId=agent_id,
            agentAliasId=agent_alias_id,
            sessionId=f"smoke-{uuid4().hex}",
            inputText=args.message,
            enableTrace=True,
        )
        completion = ""
        for event in response.get("completion", []):
            if "chunk" in event:
                completion += event["chunk"]["bytes"].decode("utf-8")

        print(json.dumps({
            "ok": True,
            "region": region,
            "agent_id": agent_id,
            "agent_alias_id": agent_alias_id,
            "response_preview": completion[:500],
        }, ensure_ascii=False, indent=2))
        return 0
    except (ClientError, BotoCoreError) as error:
        print(json.dumps({
            "ok": False,
            "region": region,
            "agent_id": agent_id,
            "agent_alias_id": agent_alias_id,
            "error_type": error.__class__.__name__,
            "error": str(error),
        }, ensure_ascii=False, indent=2))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
