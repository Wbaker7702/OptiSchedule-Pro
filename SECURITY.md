# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.

## Environment Variable Handling

Use the documented Gemini API key names consistently:

- `VITE_GEMINI_API_KEY` powers frontend-only Gemini features and is exposed in browser builds by Vite.
- `GOOGLE_GENAI_API_KEY` powers backend proxy endpoints and must remain server-only.

Do not deploy a bare `GEMINI_API_KEY`; the app does not read that name directly.
