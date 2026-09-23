# Test Plan: Petstore API — Pet CRUD Lifecycle

**API under test:** https://petstore3.swagger.io/api/v3
**Automated spec:** `tests/api/petstore/pet-crud-lifecycle.spec.ts`
**Run locally:** `npx playwright test --project=api`

## Assumptions
- The public Swagger Petstore v3 demo is available. It is shared and stored in memory, so another user touching pet `10001` at the same time can cause failures.
- Every request sends `Accept: application/json`; requests with a body send `Content-Type: application/json`.
- Tests 1.1–1.7 share state and run in order (serial mode). Each one depends on the one before.

## Test Data

| Variable | Value |
|---|---|
| `petId` | `10001` |
| Created pet | `name: "Bruno"`, `status: "available"`, `category: {id: 1, name: "Dogs"}`, `photoUrls: ["https://example.com/bruno.jpg"]`, `tags: [{id: 1, name: "friendly"}]` |
| Updated pet | Same as created, but `name: "Bruno Updated"`, `status: "sold"` |

---

## 1. Pet CRUD Lifecycle

### 1.1 Create a Pet — `POST /pet`
**Steps:**
1. Send `POST /pet` with the created-pet payload.

```bash
curl -i -X POST https://petstore3.swagger.io/api/v3/pet \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"id":10001,"name":"Bruno","status":"available","category":{"id":1,"name":"Dogs"},"photoUrls":["https://example.com/bruno.jpg"],"tags":[{"id":1,"name":"friendly"}]}'
```

**Expected Outcome:** The pet is created and echoed back.

**Success Criteria:**
- Status `200` (Petstore returns 200, not 201)
- `Content-Type` contains `application/json`
- Response body equals the payload sent

**Failure Conditions:** Non-200 status, non-JSON response, or any field differs from the payload.

### 1.2 Retrieve the Created Pet — `GET /pet/{petId}`
**Steps:**
1. Send `GET /pet/10001`.

```bash
curl -i https://petstore3.swagger.io/api/v3/pet/10001 -H 'Accept: application/json'
```

**Expected Outcome:** The pet from 1.1 is returned.

**Success Criteria:**
- Status `200`
- `Content-Type` contains `application/json`
- `id` = `10001`, `name` = `"Bruno"`, `status` = `"available"`
- Full body equals the created-pet payload

**Failure Conditions:** 404 (pet not saved), or any field differs.

### 1.3 Update the Pet — `PUT /pet`
**Steps:**
1. Send `PUT /pet` with the updated-pet payload.

```bash
curl -i -X PUT https://petstore3.swagger.io/api/v3/pet \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"id":10001,"name":"Bruno Updated","status":"sold","category":{"id":1,"name":"Dogs"},"photoUrls":["https://example.com/bruno.jpg"],"tags":[{"id":1,"name":"friendly"}]}'
```

**Expected Outcome:** The pet is updated and the new values are echoed back.

**Success Criteria:**
- Status `200`
- `Content-Type` contains `application/json`
- Response body equals the updated-pet payload

**Failure Conditions:** Non-200 status, or the response still shows the old values.

### 1.4 Validate the Updated Values — `GET /pet/{petId}`
**Steps:**
1. Send `GET /pet/10001`.

```bash
curl -i https://petstore3.swagger.io/api/v3/pet/10001 -H 'Accept: application/json'
```

**Expected Outcome:** The update from 1.3 was saved.

**Success Criteria:**
- Status `200`
- `Content-Type` contains `application/json`
- `id` = `10001`, `name` = `"Bruno Updated"`, `status` = `"sold"`
- Full body equals the updated-pet payload

**Failure Conditions:** Old values (`"Bruno"` / `"available"`) are returned.

### 1.5 Delete the Pet — `DELETE /pet/{petId}`
**Steps:**
1. Send `DELETE /pet/10001`.

```bash
curl -i -X DELETE https://petstore3.swagger.io/api/v3/pet/10001
```

**Expected Outcome:** The pet is removed.

**Success Criteria:**
- Status `200`
- Response body text is `Pet deleted`

**Failure Conditions:** Non-200 status or a different message.

### 1.6 Retrieve After Deletion Returns 404 (Negative) — `GET /pet/{petId}`
**Steps:**
1. Send `GET /pet/10001` after 1.5.

```bash
curl -i https://petstore3.swagger.io/api/v3/pet/10001 -H 'Accept: application/json'
```

**Expected Outcome:** The pet no longer exists.

**Success Criteria:**
- Status `404`
- `Content-Type` contains `application/json`
- Response body text is `Pet not found`. The body is plain text even though the header says JSON, so it is checked as text.

**Failure Conditions:** Status `200` (pet still exists) or a different error.

### 1.7 Update After Deletion Returns 404 (Negative) — `PUT /pet`
**Steps:**
1. Send `PUT /pet` with the updated-pet payload after 1.5.

```bash
curl -i -X PUT https://petstore3.swagger.io/api/v3/pet \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"id":10001,"name":"Bruno Updated","status":"sold","photoUrls":[]}'
```

**Expected Outcome:** A pet that no longer exists cannot be updated.

**Success Criteria:**
- Status `404`
- Response body text is `Pet not found`

**Failure Conditions:** Status `200` (the update brought the pet back).

---

## 2. Error Responses

### 2.1 Non-Numeric Pet ID Returns 400 (Negative) — `GET /pet/{petId}`
**Steps:**
1. Send `GET /pet/not-a-number`.

```bash
curl -i https://petstore3.swagger.io/api/v3/pet/not-a-number -H 'Accept: application/json'
```

**Expected Outcome:** The API rejects the invalid ID.

**Success Criteria:**
- Status `400`
- `Content-Type` contains `application/json`
- Body `code` = `400`
- Body `message` contains `Input error`

**Failure Conditions:** Status `200`, `404` or `500`, or the body is not a JSON error object.

---

## Known API Behaviors
- `POST /pet` returns **200**, not 201.
- A 404 body is plain text (`Pet not found`) even though the header says `application/json`.
- `DELETE` on a pet that doesn't exist still returns 200 `Pet deleted`, so deleting twice is not tested as a negative case.

## Coverage Summary

| # | Method | Endpoint | Type | Expected Status |
|---|---|---|---|---|
| 1.1 | POST | `/pet` | Positive | 200 |
| 1.2 | GET | `/pet/10001` | Positive | 200 |
| 1.3 | PUT | `/pet` | Positive | 200 |
| 1.4 | GET | `/pet/10001` | Positive | 200 |
| 1.5 | DELETE | `/pet/10001` | Positive | 200 |
| 1.6 | GET | `/pet/10001` | Negative | 404 |
| 1.7 | PUT | `/pet` | Negative | 404 |
| 2.1 | GET | `/pet/not-a-number` | Negative | 400 |
