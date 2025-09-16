# ADF Preview Extension Build Script
# 
# Usage:
#   make build      - Build the extension
#   make package    - Package extension into .vsix file  
#   make install    - Install the packaged extension
#   make full       - Build, package, and install
#   make clean      - Clean build artifacts
#   make version    - Show current version

.PHONY: build package install full clean version help

# Variables
PACKAGE_NAME = adf-preview
VERSION = $(shell node -p "require('./package.json').version")
VSIX_FILE = build/$(PACKAGE_NAME)-$(VERSION).vsix

# Default target
help:
	@echo "ADF Preview Extension Build Commands:"
	@echo "  make build      - Build the extension (TypeScript + Webpack)"
	@echo "  make package    - Package extension into .vsix file"
	@echo "  make install    - Install the packaged extension in VS Code"
	@echo "  make full       - Build, package, and install (complete workflow)"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make version    - Show current version"
	@echo "  make help       - Show this help message"

# Show current version
version:
	@echo "Current version: $(VERSION)"
	@echo "Package file: $(VSIX_FILE)"

# Build the extension
build:
	@echo "🔨 Building ADF Preview Extension..."
	yarn build
	@echo "✅ Build complete!"

# Package the extension into .vsix file
package: build
	@echo "📦 Packaging extension v$(VERSION)..."
	@mkdir -p build
	npx @vscode/vsce package --no-dependencies --no-yarn --out build/
	@echo "✅ Package created: $(VSIX_FILE)"

# Install the packaged extension
install:
	@echo "🚀 Installing ADF Preview Extension v$(VERSION)..."
	@if [ ! -f "$(VSIX_FILE)" ]; then \
		echo "❌ Package file not found: $(VSIX_FILE)"; \
		echo "   Run 'make package' first"; \
		exit 1; \
	fi
	@if command -v cursor > /dev/null; then \
		cursor --install-extension $(VSIX_FILE); \
	elif command -v code > /dev/null; then \
		code --install-extension $(VSIX_FILE); \
	else \
		echo "❌ Neither 'cursor' nor 'code' command found"; \
		echo "   Please install the extension manually: $(VSIX_FILE)"; \
		exit 1; \
	fi
	@echo "✅ Extension installed! Reload your editor to activate."

# Full workflow: build, package, install
full: package install
	@echo "🎉 Complete! Extension v$(VERSION) built, packaged, and installed."

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf build/*.vsix
	@echo "✅ Clean complete!"

# Development workflow targets
dev-build:
	@echo "🔧 Development build (with watch)..."
	yarn watch

lint:
	@echo "🔍 Running linter..."
	yarn lint

test:
	@echo "🧪 Running tests..."
	yarn test