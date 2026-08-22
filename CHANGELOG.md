# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial monorepo structure with NestJS backend, Python AI service, React Native mobile app, and shared types package.
- Drizzle ORM schemas for `users`, `farms`, `crop_records`.
- JWT authentication (register/login) in NestJS.
- `POST /api/analysis/crop` endpoint with image optimization (sharp) and integration with Python FastAPI.
- Python FastAPI service with ONNX Runtime inference endpoint `/predict`.
- React Native app with camera integration and local ONNX inference using `onnxruntime-react-native`.
- Docker Compose setup for PostgreSQL, Redis, Python AI, and NestJS.
- Root npm workspaces for unified dependency management.
- README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE files.

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A

---

## [0.1.0] - 2026-08-22

### Added

- Initial project scaffolding.
- Basic user authentication (register/login).
- Mock AI endpoint for testing.
- Database migrations for initial schema.

---

_This changelog is automatically updated via our CI pipeline. For manual entries, please follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format._
