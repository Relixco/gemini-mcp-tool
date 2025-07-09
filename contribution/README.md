# Cross-Platform Contribution Workflow 💡

**Focus on your idea, not the platform complexity.**

## TL;DR: Cross-Platform Commands

```bash
npm install && npm run build    # Once
npm run contrib:branch          # Get branch guidance
# Build your idea here
npm run contrib:test           # Test your changes
npm run contrib:submit         # Get submission guidance
```

## Cross-Platform npm Scripts

**Your job:** Build something awesome
**Our job:** Cross-platform compatibility, testing, guidance

### Available Scripts

- `npm run contrib:setup` - Setup guidance
- `npm run contrib:format` - Code formatting guidance
- `npm run contrib:test` - Run tests and linting
- `npm run contrib:branch` - Branch creation guidance
- `npm run contrib:submit` - PR submission guidance

## Migration from Shell Scripts ✅

**Old shell scripts replaced with cross-platform npm scripts:**

- ❌ `./contribution/setup.sh` → ✅ `npm install && npm run build`
- ❌ `./contribution/format.sh` → ✅ `npm run contrib:format`
- ❌ `./contribution/test.sh` → ✅ `npm run contrib:test`
- ❌ `./contribution/branch.sh` → ✅ `npm run contrib:branch`
- ❌ `./contribution/submit.sh` → ✅ `npm run contrib:submit`

## Benefits

- ✅ **Windows Native**: No WSL required
- ✅ **Cross-Platform**: Works on Windows, macOS, Linux
- ✅ **Standard**: Uses npm ecosystem tools
- ✅ **Maintainable**: No shell script dependencies

---
