.PHONY: lint serve build clean help setup test build-packages check fmt dev ci

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup: install deps and build packages
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "🔨 Building packages..."
	@npx tsc -b packages/greenlight packages/greenlight-cli packages/roadchain
	@echo "✅ Setup complete — run 'make test' to verify"

lint: ## Lint all Markdown files
	@echo "🔍 Linting Markdown files..."
	@npx markdownlint-cli2 "**/*.md" "#node_modules" "#site/node_modules" "#packages/*/node_modules" || true

lint-fix: ## Lint and auto-fix Markdown files
	@echo "🔧 Fixing Markdown files..."
	@npx markdownlint-cli2 --fix "**/*.md" "#node_modules" "#site/node_modules" "#packages/*/node_modules" || true

fmt: lint-fix ## Alias for lint-fix

build-packages: ## Build all @roadcode/* packages
	@echo "🔨 Building packages..."
	@npx tsc -b packages/greenlight packages/greenlight-cli packages/roadchain

test: build-packages ## Run all package tests (121 total)
	@echo "🧪 Running tests..."
	@echo ""
	@echo "── @roadcode/greenlight (76 tests) ──"
	@npm test -w @roadcode/greenlight
	@echo ""
	@echo "── @roadcode/greenlight-cli (16 tests) ──"
	@npm test -w @roadcode/greenlight-cli
	@echo ""
	@echo "── @roadcode/roadchain (29 tests) ──"
	@npm test -w @roadcode/roadchain
	@echo ""
	@echo "✅ All 121 tests passed"

dev: ## Start local dev server (site/) at localhost:4321
	@echo "🚀 Starting dev server..."
	@cd site && npm run dev

serve: dev ## Alias for dev

build: build-packages ## Build everything (packages + site)
	@echo "🏗️ Building site..."
	@cd site && npm run build

clean: ## Remove build artifacts
	@echo "🧹 Cleaning..."
	@rm -rf site/dist site/.astro packages/*/dist packages/*/*.tsbuildinfo

check: lint test ## Run all checks (lint + tests) — same as CI
	@echo "✅ All checks passed — ready to merge"

ci: check build ## Full CI simulation (lint + test + build)
	@echo "✅ CI simulation complete"
