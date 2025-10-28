# Repository Guidelines

## Project Structure & Module Organization
The repository currently contains the `code/` workspace; treat it as the project root. Place reusable Python modules under `src/heart_disease/` with clear subpackages for `ingest`, `features`, and `models`. Keep experiment notebooks in `notebooks/` and move reference outputs to `reports/`. Persist datasets under `data/raw/` (read-only) and derived artifacts under `data/processed/`. Store trained weights or exported models in `models/` and configuration YAML in `configs/`. Add an `__init__.py` in every package directory so modules can be imported via `src.heart_disease.*`.

## Build, Test, and Development Commands
- `python3 -m venv .venv && source .venv/bin/activate`: create/activate the local virtual environment.
- `python -m pip install -r requirements.txt`: install the pinned dependencies before running anything.
- `pytest`: run the automated test suite; use `pytest -k <pattern>` for a focused run.
- `ruff check src tests`: lint code for style and static issues.
- `python -m src.heart_disease.cli train --config configs/default.yaml`: example entry point for model training.

## Coding Style & Naming Conventions
Use PEP 8 with 4-space indentation and type hints on public APIs. Prefer descriptive module names such as `preprocess_scalers.py`. Functions in `src/heart_disease` should follow verb-noun patterns (`build_feature_matrix`). Keep notebooks numbered (`notebooks/01_exploration.ipynb`). Run `ruff format` or `black` before committing; keep lines ≤ 88 characters and document complex routines with Google-style docstrings.

## Testing Guidelines
Write tests with `pytest`, mirroring package structure (e.g., `tests/ingest/test_loader.py`). Name fixtures descriptively and seed randomness inside tests for reproducibility. Target ≥90% branch coverage; run `pytest --cov=src/heart_disease --cov-report=term-missing` before submitting a PR. Include integration tests for CLI pipelines in `tests/integration/`.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `docs:`) with concise, imperative summaries. Reference issue IDs in the body when applicable. Each PR should include: purpose summary, testing evidence (command output or screenshots), and notes on data/model changes. Keep PRs scoped to a single concern and request review before merging; re-run lint and tests after rebasing.
