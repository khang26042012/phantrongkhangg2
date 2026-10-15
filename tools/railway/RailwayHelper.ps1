<#
.SYNOPSIS
Railway PowerShell Automation Module

.DESCRIPTION
Native PowerShell helper for querying Railway GraphQL API and managing deployments
with built-in anti-Cloudflare header simulation.
#>

$global:RAILWAY_TOKEN = if ($env:RAILWAY_API_TOKEN) { $env:RAILWAY_API_TOKEN } elseif ($env:RAILWAY_TOKEN) { $env:RAILWAY_TOKEN } else { "273969db-0b99-4da5-b3c0-3c35e90f665e" }
$global:RAILWAY_WORKSPACE_ID = "e5a04dd7-40fe-471c-900c-0e7489de677f"
$global:RAILWAY_ENDPOINT = "https://backboard.railway.com/graphql/v2"

function Invoke-RailwayGraphQL {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Query,
        [hashtable]$Variables = @{}
    )

    $headers = @{
        "Content-Type"  = "application/json"
        "Authorization" = "Bearer $global:RAILWAY_TOKEN"
        "User-Agent"    = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        "Accept"        = "application/json"
        "Origin"        = "https://railway.com"
        "Referer"       = "https://railway.com/"
    }

    $body = @{
        query = $Query
    }
    if ($Variables.Count -gt 0) {
        $body["variables"] = $Variables
    }

    $jsonBody = $body | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $global:RAILWAY_ENDPOINT -Method Post -Headers $headers -Body $jsonBody
        if ($response.errors) {
            Write-Error ($response.errors | ConvertTo-Json -Depth 5)
            return $null
        }
        return $response.data
    } catch {
        Write-Error $_
        return $null
    }
}

function Get-RailwayAccount {
    $q = "query { me { id name email workspaces { id name } } }"
    $res = Invoke-RailwayGraphQL -Query $q
    return $res.me
}

function Get-RailwayProjects {
    param([string]$WorkspaceId = $global:RAILWAY_WORKSPACE_ID)
    $q = 'query GetProjects($workspaceId: String!, $first: Int!) { projects(workspaceId: $workspaceId, first: $first) { edges { node { id name description createdAt updatedAt } } } }'
    $vars = @{ workspaceId = $WorkspaceId; first = 10 }
    $res = Invoke-RailwayGraphQL -Query $q -Variables $vars
    return $res.projects.edges | ForEach-Object { $_.node }
}

Write-Output "RailwayHelper initialized successfully for workspace: $global:RAILWAY_WORKSPACE_ID"
