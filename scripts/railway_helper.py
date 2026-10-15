#!/usr/bin/env python3
"""
Railway Automation & GraphQL Helper Tool
Automates project management, deployments, and logging on Railway via GraphQL v2 API
with built-in anti-Cloudflare header simulation.
"""

import sys
import json
import os
import argparse
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

DEFAULT_TOKEN = os.environ.get("RAILWAY_API_TOKEN") or os.environ.get("RAILWAY_TOKEN") or "273969db-0b99-4da5-b3c0-3c35e90f665e"
DEFAULT_WORKSPACE_ID = "e5a04dd7-40fe-471c-900c-0e7489de677f"
GRAPHQL_ENDPOINT = "https://backboard.railway.com/graphql/v2"

# Browser simulation headers to bypass Cloudflare bot mitigation (HTTP 403 / Error 1010)
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {DEFAULT_TOKEN}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://railway.com",
    "Referer": "https://railway.com/",
}

def query_railway(query_str: str, variables: dict = None, token: str = None) -> dict:
    headers = dict(HEADERS)
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    payload = {"query": query_str}
    if variables:
        payload["variables"] = variables

    req = urllib.request.Request(
        GRAPHQL_ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if "errors" in data:
                raise RuntimeError(f"GraphQL Errors: {json.dumps(data['errors'], indent=2)}")
            return data.get("data", {})
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        raise RuntimeError(f"HTTP Error {e.code}: {error_body}")
    except Exception as e:
        raise RuntimeError(f"Request failed: {str(e)}")

def get_me() -> dict:
    """Fetch current authenticated user and workspaces."""
    query = """
    query {
      me {
        id
        name
        email
        workspaces {
          id
          name
        }
      }
    }
    """
    return query_railway(query)

def get_projects(workspace_id: str = DEFAULT_WORKSPACE_ID, first: int = 10) -> list:
    """Fetch projects in a workspace."""
    query = """
    query GetProjects($workspaceId: String!, $first: Int!) {
      projects(workspaceId: $workspaceId, first: $first) {
        edges {
          node {
            id
            name
            description
            createdAt
            updatedAt
          }
        }
      }
    }
    """
    res = query_railway(query, {"workspaceId": workspace_id, "first": first})
    edges = res.get("projects", {}).get("edges", [])
    return [edge["node"] for edge in edges]

def create_project(name: str, workspace_id: str = DEFAULT_WORKSPACE_ID, description: str = "") -> dict:
    """Create a new project on Railway."""
    query = """
    mutation CreateProject($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        id
        name
        description
      }
    }
    """
    variables = {
        "input": {
            "name": name,
            "workspaceId": workspace_id,
            "description": description or f"Deployed via Railway Automation Tool"
        }
    }
    res = query_railway(query, variables)
    return res.get("projectCreate", {})

def get_deployment_status(deployment_id: str) -> dict:
    """Fetch deployment status and metadata."""
    query = """
    query GetDeployment($id: String!) {
      deployment(id: $id) {
        id
        status
        createdAt
        meta
      }
    }
    """
    return query_railway(query, {"id": deployment_id}).get("deployment", {})

def get_build_logs(deployment_id: str, limit: int = 100) -> list:
    """Fetch build logs for a deployment."""
    query = """
    query GetBuildLogs($deploymentId: String!, $limit: Int!) {
      buildLogs(deploymentId: $deploymentId, limit: $limit) {
        message
        timestamp
        severity
      }
    }
    """
    return query_railway(query, {"deploymentId": deployment_id, "limit": limit}).get("buildLogs", [])

def main():
    parser = argparse.ArgumentParser(description="Railway CLI & GraphQL Helper Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # whoami
    subparsers.add_parser("whoami", help="Check authenticated user profile")

    # projects
    proj_p = subparsers.add_parser("projects", help="List projects in workspace")
    proj_p.add_argument("--workspace", default=DEFAULT_WORKSPACE_ID, help="Workspace ID")
    proj_p.add_argument("--limit", type=int, default=10, help="Max items")

    # create-project
    create_p = subparsers.add_parser("create-project", help="Create new project")
    create_p.add_argument("name", help="Project name")
    create_p.add_argument("--workspace", default=DEFAULT_WORKSPACE_ID, help="Workspace ID")
    create_p.add_argument("--desc", default="", help="Description")

    # deployment
    dep_p = subparsers.add_parser("deployment", help="Get deployment status")
    dep_p.add_argument("id", help="Deployment ID")

    # logs
    log_p = subparsers.add_parser("logs", help="Get build logs")
    log_p.add_argument("deployment_id", help="Deployment ID")
    log_p.add_argument("--limit", type=int, default=100, help="Max lines")

    # query
    raw_p = subparsers.add_parser("query", help="Run raw GraphQL query string")
    raw_p.add_argument("query_str", help="GraphQL Query")

    args = parser.parse_args()

    if not args.command or args.command == "whoami":
        data = get_me()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    elif args.command == "projects":
        projs = get_projects(args.workspace, args.limit)
        print(json.dumps(projs, indent=2, ensure_ascii=False))
    elif args.command == "create-project":
        res = create_project(args.name, args.workspace, args.desc)
        print(json.dumps(res, indent=2, ensure_ascii=False))
    elif args.command == "deployment":
        res = get_deployment_status(args.id)
        print(json.dumps(res, indent=2, ensure_ascii=False))
    elif args.command == "logs":
        logs = get_build_logs(args.deployment_id, args.limit)
        for log in logs:
            ts = log.get("timestamp", "")
            msg = log.get("message", "")
            print(f"[{ts}] {msg}")
    elif args.command == "query":
        res = query_railway(args.query_str)
        print(json.dumps(res, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
