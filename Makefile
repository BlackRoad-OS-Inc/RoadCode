.PHONY: lint serve build clean help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

lint: ## Lint all Markdown files
	@echo "🔍 Linting Markdown files..."
	@npx markdownlint-cli2 "**/*.md" "#node_modules" "#site/node_modules" || true

lint-fix: ## Lint and auto-fix Markdown files
	@echo "🔧 Fixing Markdown files..."
	@npx markdownlint-cli2 --fix "**/*.md" "#node_modules" "#site/node_modules" || true

serve: ## Start local dev server (site/)
	@echo "🚀 Starting dev server..."
	@cd site && npm run dev

build: ## Build the static site (site/)
	@echo "🏗️ Building site..."
	@cd site && npm run build

clean: ## Remove build artifacts
	@echo "🧹 Cleaning..."
	@rm -rf site/dist site/.astro

check: lint ## Run all checks
	@echo "✅ All checks passed"
