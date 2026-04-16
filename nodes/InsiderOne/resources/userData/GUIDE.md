# userData Resource — Operation Guide

## Operations

### 1. Create or Update (upsert)

**Endpoint:** `POST https://unification.useinsider.com/api/user/v1/upsert`

**Purpose:** Create a new user or update an existing one with attributes and/or events.

#### Identifier Types
| Type | Field | Notes |
|------|-------|-------|
| Insider ID | `insider_id` | String, Insider's internal user ID |
| Identifiers | `email`, `uuid`, `phone_number`, `custom` | At least one required |

#### Attributes (UI Mode)
Standard fields: `age`, `birthday`, `city`, `country`, `email`, `email_optin`, `gdpr_optin`, `gender`, `language`, `lo` (locale), `name`, `phone_number`, `sms_optin`, `static_segment_id`, `surname`, `uuid`, `whatsapp_optin`

- `birthday` → RFC 3339 format (e.g. `1993-03-12T00:00:00Z`)
- `country` → ISO 3166-1 alpha-2 (e.g. `US`, `TR`)
- `phone_number` → E.164 format (e.g. `+6598765432`)
- `static_segment_id` → comma-separated IDs, converted to integer array
- Custom attributes → JSON object with `c_` prefixed keys (e.g. `{"c_loyalty_tier": "gold"}`)

#### Events (UI Mode)
Each event requires: `event_name` (string), `timestamp` (dateTime), optional `event_params` (JSON object)

#### JSON Mode
- `attributesJson` → plain JSON object: `{"name": "John", "email_optin": true}`
- `eventsJson` → array of event objects: `[{"event_name": "purchase", "timestamp": "...", "event_params": {...}}]`

#### Additional Settings
| Setting | Default | Notes |
|---------|---------|-------|
| Batch Size | 1 | Groups N input items into one API call. All items must share the same credentials/settings. |
| Not Append | true | If true, overwrites existing arrays/attributes instead of appending |
| Skip Hook | false | If true, historical data skips triggering journeys/data streams |
| Error Callback Endpoint | — | Webhook URL for async error notifications |

#### Batch Behavior
- Batch Size = 1 → one API call per input item
- Batch Size = N → groups N items into a single `users[]` array per call
- Response is one item per batch group (not per user)

---

### 2. Get User Profiles (getProfile)

**Endpoint:** `POST https://unification.useinsider.com/api/user/v1/profile`

**Purpose:** Query attribute and/or event data for a single user.

**Requirement:** At least one of `attributes` or `events` must be provided. If neither is set, the node throws an error.

#### Identifier Types
Same as upsert — `insider_id` string or `identifiers` object.

#### Attributes (UI Mode)
- **Get All Attributes** toggle → sends `["*"]` to return all available attributes
- **Attributes multiOptions** → select from standard list: `age`, `birthday`, `city`, `country`, `email`, `email_optin`, `gdpr` (GDPR Opt-In), `gender`, `language`, `lo`, `name`, `phone_number`, `sms_optin`, `surname`, `uuid`, `whatsapp_optin`
  - Note: GDPR Opt-In is returned as `gdpr` (not `gdpr_optin`) in the API response
- **Custom Attributes** → comma-separated names with `c_` prefix (e.g. `c_member_code, c_loyalty_tier`)

#### Events (UI Mode)
- `startDate` / `endDate` → converted to Unix timestamps
- **Wanted Events** (fixedCollection) → `event_name` + comma-separated `params`
- **Wanted Events (JSON)** → raw JSON array, overrides UI wanted events if set

#### JSON Mode
- `profileAttributesJson` → array: `["email", "name", "c_member_code"]` or `["*"]`
- `profileEventsJson` → object: `{"start_date": 1704067200, "end_date": 1706745600, "wanted": [{"event_name": "purchase", "params": ["product_id"]}]}`

#### Quota
Optional number — set to view quota usage for the payload.

---

### 3. Export Raw Data (export)

**Endpoint:** `POST https://unification.useinsider.com/api/raw/v1/export`

**Purpose:** Export raw user data from a segment to a file delivered via webhook.

**Important:** Only **dynamic segments** are supported. Static segments will return 400.

#### Segment ID
Required. Must be a valid dynamic segment ID from Insider.

#### Attributes (UI Mode)
- **Get All Attributes** toggle → sends `["*"]`
- **Attributes multiOptions** → same standard list as getProfile
- **Custom Attributes** → comma-separated `c_` prefixed names

#### Events (UI Mode)
Same structure as getProfile — Start Date, End Date, Wanted Events (UI + JSON).

#### JSON Mode
- `exportAttributesJson` → array: `["email", "name"]` or `["*"]`
- `exportEventsJson` → object with `start_date`, `end_date`, `wanted`

#### Format
`json` (default), `csv`, or `parquet`

#### Webhook URL
URL to receive the export completion notification. The download link expires in 24 hours.

---

## Shared Patterns

### Identifier Object Structure
```json
// insider_id mode
{ "insider_id": "abc123" }

// identifiers mode
{
  "identifiers": {
    "email": "user@example.com",
    "uuid": "...",
    "phone_number": "+6598765432",
    "custom": { "user_loyalty_id": "xyz123" }
  }
}
```

### Standard Attribute Keys (API names)
| Display Name | API Key |
|--------------|---------|
| Age | `age` |
| Birthday | `birthday` |
| City | `city` |
| Country | `country` |
| Email | `email` |
| Email Opt-In | `email_optin` |
| GDPR Opt-In | `gdpr` |
| Gender | `gender` |
| Language | `language` |
| Locale | `lo` |
| Name | `name` |
| Phone Number | `phone_number` |
| SMS Opt-In | `sms_optin` |
| Surname | `surname` |
| UUID | `uuid` |
| WhatsApp Opt-In | `whatsapp_optin` |

> **Note:** GDPR Opt-In is set via upsert as `gdpr_optin` but returned in getProfile/export responses as `gdpr`.
