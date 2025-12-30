## Mental Health Companion API Contract

Base URL (dev): `http://localhost:8080/api/v1`

Auth: JWT (access + refresh). Access token via `Authorization: Bearer <token>`.

---

### Auth
- `POST /auth/register`
  - Body: `{ "email", "password", "fullName" }`
  - 201 → `{ "userId", "profile": {...}, "tokens": { "access", "refresh" } }`
- `POST /auth/login`
  - Body: `{ "email", "password" }`
  - 200 → `{ "userId", "profile", "tokens" }`
- `POST /auth/refresh`
  - Body: `{ "refreshToken" }`
  - 200 → `{ "accessToken", "expiresIn" }`
- `POST /auth/logout`
  - Body: `{ "refreshToken" }`
  - 204

### Profiles
- `GET /profiles/me`
  - 200 → profile object (matches current Supabase schema + `initialScreeningCompleted` flag)
- `PUT /profiles/me`
  - Body: `country?`, `phone?`, `homeAddress?`, `pincode?`
  - 200 → updated profile
- `POST /profiles/initial-screening`
  - Body: `{ responses: Record<number, number> }`
  - 201 → `{ result: { score, severity, diagnosis }, profile }`

### Assessments
- `GET /assessments`
  - Query: `type?`, `limit?`, `sort?`
  - 200 → list of `{ id, type, score, severity, diagnosis, createdAt }`
- `POST /assessments`
  - Body: `{ type, responses, score, severity, diagnosis }`
  - 201 → created assessment
- `GET /assessments/{id}`
  - 200 → detailed record (includes responses)

### Emergency Contacts
- `GET /contacts`
- `POST /contacts`
  - Body: `{ name, phone, relationship, isDefault? }`
- `PUT /contacts/{id}`
  - Toggle default, update info
- `DELETE /contacts/{id}`
- `POST /contacts/{id}/alert`
  - Simulated emergency alert (hooks for SMS/push later)

### Vital Readings
- `GET /vitals`
  - Query: `limit?=50`
- `POST /vitals`
  - Body mirrors `vital_readings` schema; backend can enrich with `isEmergency`
- `GET /vitals/{id}`

### Doctor Search
- `GET /doctors/search`
  - Query: `term`, `lat`, `lng`
  - Returns list aggregated from third-party (placeholder now uses Google Maps deep-link)
- `GET /doctors/suggestions`
  - Returns curated specialties for quick buttons

### Notifications (future-ready)
- `GET /notifications`
- `POST /notifications/send-test` (admin only)

### Error format
```
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: ...",
  "path": "/api/v1/..."
}
```


