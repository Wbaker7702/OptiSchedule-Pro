# Security Policy

## Reporting a vulnerability

If you discover a security issue, avoid opening a public issue with sensitive details.
Open a private security advisory or contact the maintainers directly.

## Secret exposure response checklist

If any API key or token is committed:

1. Rotate the secret immediately.
2. Revoke the exposed credential in the provider console.
3. Replace committed secrets with environment variables and purge the sensitive data from Git history (e.g., using git filter-repo).
4. Add/update ignore rules so local credential files are never committed.
5. Check provider audit logs for suspicious usage.
6. Close the alert as revoked after remediation is complete.
