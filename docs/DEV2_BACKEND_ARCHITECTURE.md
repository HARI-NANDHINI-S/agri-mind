# AgriMind Developer 2 Backend Architecture

## 1. Backend folder structure

```text
app/
  main.py
  core/{config.py,security.py,exceptions.py}
  database/{base.py,session.py}
  models/
  schemas/
  api/routes/
  services/
  repositories/
  ml/price_prediction/{features.py,train.py,predict.py,artifacts/}
  assistant/{intent.py,context.py,rag.py,llm.py,service.py}
  utils/
tests/{api,services}
alembic/versions/
docs/
```

Developer 2 owns only the ten tables below. `users`, `farms`, `fields`, and `crops` remain Developer 1 tables and are referenced by `user_id`, `farm_id`, `field_id`, and `crop_id`.

## 2. Database schema

| Table | Ownership and important columns |
| --- | --- |
| `expenses` | `user_id`, farm/field/crop references, category, amount, expense date |
| `market_prices` | crop/market/location, price, unit, source, price date |
| `price_predictions` | user, crop, market, horizon, forecast JSON, model version |
| `profitability_records` | user, farm/field/crop, yield, price, cost, revenue, profit, margin, break-even |
| `risk_assessments` | user, farm/field/crop, component risks, score, explanation |
| `notifications` | user, type, message, optional reference, read state |
| `ai_conversations` / `ai_messages` | user-owned conversations and auditable messages/sources |
| `knowledge_documents` | knowledge metadata, source content, chunk/vector references |
| `model_registry` | model identity, dataset, metrics, artifact path, lifecycle status |

Use numeric types for money and quantities, UTC timestamps, ownership indexes, and indexes for expense user/crop/field/date and notification user/read state. Foreign keys to Developer 1 tables are added against the shared schema during integration; no duplicate tables are created here.

## 3. Alembic migration plan

Keep migrations additive and independently reversible. The existing Dev2 migration is the initial table migration; split future work into module migrations: expense indexes/constraints, market and prediction tables, profitability/risk tables, notifications, assistant tables, and model registry. Do not drop or alter Developer 1 tables. Once their revision IDs are available, add explicit foreign keys in a follow-up integration migration and set `depends_on` to the shared head where required.

## 4. API endpoint list

All routes are under `/api/v1/` and return `{success, message, data}` on success and `{success, message, error_code}` on errors.

- Expenses: `POST/GET /expenses`, `GET/PUT/DELETE /expenses/{expense_id}`, `GET /expenses/summary`, `GET /expenses/analytics`
- Market: `GET /market/prices`, `/market/prices/{id}`, `/market/history`, `/market/compare`, `/market/summary`
- ML: `POST /ml/price-prediction`
- Profitability: `GET /profitability`, `/profitability/{crop_id}`, `POST /profitability/calculate`, `GET /profitability/compare`
- Admin: `GET /admin/dashboard`, `/admin/users`, `/admin/users/{id}`, `PUT /admin/users/{id}/status`, `/admin/analytics`, `/admin/models`, `/admin/models/{id}`
- Assistant: `POST /assistant/chat`
- Notifications: `GET /notifications`, `PUT /notifications/{id}/read`, `PUT /notifications/read-all`, `DELETE /notifications/{id}`

## 5. Pydantic schemas

Use separate create, update, read, filter, and response schemas. Validate positive monetary/quantity values, bounded pagination, enum categories/types, ISO dates, prediction horizons, and assistant message length. `user_id`, role, ownership, and model paths are never accepted as authority from request bodies.

## 6. Service architecture

Routes resolve the JWT user and database session, services enforce ownership and business rules, repositories perform scoped queries, and models persist data. Cross-module services use interfaces or service methods, so profitability consumes expense and market/yield services without duplicating their data access.

## 7. ML price prediction architecture

Ingest CSV/API data through a validated adapter with columns `date`, `crop`, `market`, `location`, and `price`. Sort each series by date, create lag/rolling/calendar features, encode crop and market, and use time-based train/validation splits. Train Linear Regression, Random Forest, and XGBoost; compare MAE, RMSE, and applicable MAPE; persist the selected pipeline with Joblib plus JSON metadata and a `model_registry` row. Inference validates that enough recent history exists, returns a forecast with uncertainty/disclaimer metadata, and stores the request/result in `price_predictions`.

## 8. Profitability calculation architecture

Resolve the authenticated user's crop/field context, obtain predicted yield from the shared yield service, expected price from market/prediction services, and actual scoped expenses from the expense service. Calculate `revenue = yield * price`, `profit = revenue - cost`, `margin = profit / revenue * 100` when revenue is nonzero, and `break_even_price = cost / yield` when yield is nonzero. Persist the inputs and derived values for auditability.

## 9. Risk scoring architecture

Begin with explainable rules. Compute market volatility, yield variance against available history, recent disease signals from Developer 1, and expense deviation from the user's historical average. Normalize each component to a 0-100 score, weight the components, map the total to LOW/MEDIUM/HIGH, and return the reasons and missing-data notes. Label it as an assessment, never a guarantee.

## 10. AI assistant and RAG architecture

Classify intent, build a user-scoped context bundle, retrieve top agriculture knowledge chunks from ChromaDB, invoke price/profit/risk services only when the intent needs them, and call the LLM with facts, predictions, and general knowledge clearly labeled. Persist conversation/messages and source references. If a fact or service result is missing, say it is unavailable; never infer farmer-specific values.

## 11. Notification architecture

Expose a framework-agnostic `NotificationService.create()` used by price, disease, harvest, and financial services. Notification queries are always user-scoped. Start scheduled checks with APScheduler for daily price, harvest, financial threshold, and disease tasks; keep tasks idempotent and move to a queue only when measured scale requires it.

## 12. Admin architecture

Use one reusable `require_admin` dependency that validates the existing JWT role claim and, after integration, the authoritative user role. Dashboard endpoints use SQL aggregation/count queries, never full-table loading. Model registry is read-only through the API initially; artifact paths are server-managed and uploads require validation, allowlisting, and checksum/scanning.

## 13. Developer 1 integration points

Consume the existing JWT dependency and claims. Reference existing `users`, `farms`, `fields`, and `crops`; never define them locally. Consume crop recommendation, disease detection, and yield prediction service contracts. Confirm shared table primary-key types and Alembic head before adding foreign-key constraints.

## 14. Testing strategy

Unit-test expense ownership/filtering, financial formulas, risk rules, feature generation, and model selection. API-test authentication, CRUD, pagination, market filters, prediction persistence, notifications, assistant missing-data behavior, and admin authorization. Use a disposable test database or SQLite-compatible repository fixture, factory data scoped to multiple users, and mocked external LLM/market/model providers.

## 15. Docker strategy

Run the FastAPI service and MySQL in Compose with health checks, a non-root backend image, environment-driven configuration, and a persistent MySQL volume. Run Alembic explicitly as a deploy/startup step. Keep model artifacts and ChromaDB under mounted paths; do not place secrets in the image or repository. A separate vector database is unnecessary while ChromaDB is local.

## Delivery sequence

Implement and test expenses first, then market ingestion/read APIs, price prediction, profitability, risk, notifications, assistant/RAG, admin aggregation, and model registry. Each module should land as a focused change and be rebased against the shared Developer 1 schema before merging.
