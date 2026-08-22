# Contributing to Crop-AI

Thank you for considering contributing to Crop-AI! We welcome contributions from developers, researchers, and farmers who want to improve agricultural AI. Please follow these guidelines to make the process smooth for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](https://github.com/your-org/crop-ai-monorepo/issues).
- If not, open a new issue with:
  - A clear, descriptive title.
  - Steps to reproduce the bug.
  - Expected and actual behavior.
  - Screenshots or logs if applicable.
  - Your environment (OS, Node.js version, Docker version, mobile device).

### Suggesting Enhancements

- Open an issue with the tag `enhancement`.
- Describe the feature, why it's valuable, and any implementation ideas.

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Follow the coding standards**:
   - **TypeScript/JavaScript**: Use ESLint and Prettier (configs are in each app folder).
   - **Python**: Use Black and isort (run `black .` and `isort .` in the `ai-service` folder).
3. **Write or update tests** for your changes.
4. **Ensure all tests pass**:

   ```bash
   npm run test
   ```

5. **Update the `CHANGELOG.md`** with a brief description of your changes under the "Unreleased" section.
6. **Open a pull request** against the `main` branch.
   - Link the related issue (if any).
   - Describe what you changed and why.
   - Include screenshots for UI changes.

### Development Setup

Follow the [Getting Started](README.md#-getting-started) section in the `README.md` to set up the project locally.

## Style Guide

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters.
- Reference issues and pull requests liberally.

Example:

```
feat(backend): add /api/analysis/history endpoint

Closes #12
```

### TypeScript

- Use strict typing (`strict: true` in `tsconfig.json`).
- Prefer `interface` over `type` for object shapes.
- Export all shared types from the `shared-types` package.

### Python

- Use type hints for all function arguments and return values.
- Follow PEP 8.
- Keep functions small and focused.

## Getting Help

If you have any questions, feel free to reach out via the [Discussions](https://github.com/your-org/crop-ai-monorepo/discussions) tab or open an issue for clarification.

Thank you for contributing to make Crop-AI better! 🌾
