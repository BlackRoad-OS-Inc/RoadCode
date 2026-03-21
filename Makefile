.PHONY: lint serve build clean help setup test build-packages

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup: install deps and build packages
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "🔨 Building packages..."
	@npx tsc -b packages/greenlight packages/greenlight-cli
	@echo "✅ Setup complete — run 'make test' to verify"

lint: ## Lint all Markdown files
	@echo "🔍 Linting Markdown files..."
	@npx markdownlint-cli2 "**/*.md" "#node_modules" "#site/node_modules" || true

lint-fix: ## Lint and auto-fix Markdown files
	@echo "🔧 Fixing Markdown files..."
	@npx markdownlint-cli2 --fix "**/*.md" "#node_modules" "#site/node_modules" || true

build-packages: ## Build @roadcode/greenlight and CLI packages
	@echo "🔨 Building packages..."
	@npx tsc -b packages/greenlight packages/greenlight-cli

test: build-packages ## Run all package tests
	@echo "🧪 Running tests..."
	@npm test -w @roadcode/greenlight

serve: ## Start local dev server (site/)
	@echo "🚀 Starting dev server..."
	@cd site && npm run dev

build: build-packages ## Build everything (packages + site)
	@echo "🏗️ Building site..."
	@cd site && npm run build

clean: ## Remove build artifacts
	@echo "🧹 Cleaning..."
	@rm -rf site/dist site/.astro packages/*/dist packages/*/*.tsbuildinfo

check: lint test ## Run all checks (lint + tests)
	@echo "✅ All checks passed"
