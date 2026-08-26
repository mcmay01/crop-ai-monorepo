# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the latest major version of Crop-AI. Older versions may not receive security updates.

| Version | Supported         |
| ------- | ----------------- |
| 1.x     | ✅ Active support |
| < 1.0   | ❌ Not supported  |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Crop-AI, please report it privately.

**Please DO NOT file a public issue.** Instead, send an email to **[hi@mahadmayanja.com]** with:

- A clear description of the vulnerability.
- Steps to reproduce it (proof-of-concept code is highly appreciated).
- The version(s) affected.
- Any potential impact and your suggested fix (if any).

We will respond within **48 hours** to acknowledge your report. We aim to provide a fix within **7–14 days** depending on the severity and complexity.

## What to Expect

- We will confirm the vulnerability and assess its impact.
- We will work on a fix and release a new version.
- We will credit you (if you wish) in the release notes and the `CHANGELOG.md`.

## Disclosure Policy

We follow coordinated disclosure. We will notify the public about the vulnerability after a fix has been released and users have had time to upgrade.

## Security Best Practices

- Always use the latest version of the backend, AI service, and mobile app.
- Rotate your `JWT_SECRET` and database passwords regularly.
- Use environment variables for all secrets – never hardcode them in source code.
- For production deployments, use HTTPS, enable CORS with strict origin lists, and run the Python service behind a firewall.

If you have any security-related questions, feel free to contact us via the email above.

Thank you for helping keep Crop-AI secure! 🌾
