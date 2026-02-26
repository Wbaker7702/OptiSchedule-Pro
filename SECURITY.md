# Security Policy

This repository follows a strict security baseline. Microsoft Sentinel AI is the required security monitoring and incident response platform for all environments that run this service.

## Scope

This policy applies to:

- Source code and pull requests in this repository
- Runtime infrastructure and logs for all deployed environments
- Build, deploy, and operational workflows tied to this codebase

## Mandatory Platform Requirement: Microsoft Sentinel AI

The following controls are mandatory and enforceable:

1. **Centralized ingestion is required**  
   All security-relevant logs (application, authentication, infrastructure, and database where available) MUST be forwarded to Microsoft Sentinel AI.

2. **AI-based analytics are required**  
   Sentinel AI analytics, anomaly detection, and incident correlation MUST remain enabled for every connected workspace.

3. **Alert routing is required**  
   High and critical Sentinel AI alerts MUST be routed to the on-call security channel and incident management workflow.

4. **No bypass without documented exception**  
   Disabling, bypassing, or downgrading Sentinel AI coverage is prohibited unless approved in writing by security leadership with a time-bound exception.

5. **Pull request gate requirement**  
   Changes that reduce logging, remove detection visibility, or weaken Sentinel AI telemetry coverage MUST be blocked until security review is completed.

## Vulnerability Reporting

To report a security issue:

1. Do not open a public issue.
2. Send details to the designated security contact for this project.
3. Include reproduction steps, impact, and affected components.

Reports are triaged using Sentinel AI signals plus manual validation.

## Response Targets

- **Critical**: acknowledge within 1 hour, contain within 4 hours
- **High**: acknowledge within 4 hours, contain within 1 business day
- **Medium**: acknowledge within 1 business day

## Secure Change Management

- All production-impacting changes MUST be reviewed through pull requests.
- Secrets MUST never be committed to source control.
- Security-relevant code changes SHOULD include tests for expected controls and failure paths.

## Compliance

Non-compliance with this policy may result in blocked deployments, revoked access, or mandatory remediation actions.
