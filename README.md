# n8n-nodes-insiderone

An [n8n](https://n8n.io/) community node package that integrates with [Insider One](https://insiderone.com/). It enables seamless data flow between n8n workflows and Insider — covering the full range of [Insider One APIs](https://academy.insiderone.com/docs/insider-one-apis), from user data unification to data governance.

## Installation

### Community Nodes (recommended)

In your n8n instance, go to **Settings → Community Nodes**, click **Install**, and enter:

```
@useinsider/n8n-nodes-insiderone
```

### npm (self-hosted)

```bash
npm install @useinsider/n8n-nodes-insiderone
```

### Docker

```bash
# First run — build and start
docker compose up --build

# Subsequent runs
docker compose up

# After a code update
git pull
docker compose up --build
```

n8n becomes available at `http://localhost:5678`.

## Credentials

The node uses the **Insider One Unification API** credential, which requires two values issued by Insider:

| Field | Description |
|-------|-------------|
| **Insider One Inone Name** | Your Insider partner/brand name in lowercase (e.g. `mybrand`). |
| **Unified Customer Database API Token** | API token used to authenticate requests. |

You can find both values in the Insider panel under **Settings → Integration Settings**. For full details, see the [Insider One API reference](https://academy.insiderone.com/docs/api-reference-welcome).

When you save the credential, the node performs an authenticated test call to the Unification API to verify the values. If the test fails, double-check that the partner name is lowercase and the token has the required scopes.

## Operations

This package exposes two resources. Each resource groups related operations.

### User Data

| Operation | Description | Endpoint |
|-----------|-------------|----------|
| **Create or Update** | Upsert a user profile with attributes and/or events. Supports batching of multiple input items into a single API call. | `POST /api/user/v1/upsert` |
| **Get User Profiles** | Query user profile information by identifier. Returns selected attributes and events. | `POST /api/user/v1/profile` |
| **Update Identifiers** | Replace an existing identifier (e.g. email) with a new value. | `PATCH /api/user/v1/identity` |
| **Delete Identifiers** | Remove one or more identifiers from a user profile. | `DELETE /api/user/v1/identity` |
| **Delete User Attribute** | Remove specific attributes — fully or partial values — from a user profile. | `POST /api/user/v1/attribute/delete` |
| **Export Raw Data** | Export segment data asynchronously in CSV, JSON, or Parquet format. | `POST /api/raw/v1/export` |

### Data Governance

| Operation | Description | Endpoint |
|-----------|-------------|----------|
| **Delete User Profile** | Permanently delete a user profile. | `POST /api/user/v1/delete` |
| **Delete User's PII Data** | Anonymize a user's personally identifiable information. | `POST /api/user/v1/anonymize` |

All operations support both a structured UI mode and a raw **JSON parameters** mode for advanced use cases. Identifiers (`email`, `uuid`, `phone_number`, `insider_id`, custom) can be combined as needed.

## Example workflows

### Sync signups to Insider

A common pattern is forwarding new user signups from your application to Insider as soon as they happen.

1. Add a **Webhook** node to receive signup events (POST with `email`, `name`, `country` in the body).
2. Add the **Insider One** node and configure:
   - **Resource:** `User Data`
   - **Operation:** `Create or Update`
   - **Identifiers → Email Address:** `{{ $json.email }}`
   - **Attributes → Name:** `{{ $json.name }}`
   - **Attributes → Country:** `{{ $json.country }}`
   - **Attributes → Email Opt-In:** `true`

To send many signups in a single API call, expand **Additional Settings** and set **Batch Size** to a higher value. The node groups input items and sends one upsert request per batch.

### Export a segment

1. Add an **Insider One** node and configure:
   - **Resource:** `User Data`
   - **Operation:** `Export Raw Data`
   - **Segment ID:** the dynamic segment ID you want to export
   - **Format:** `CSV` / `JSON` / `Parquet`
   - **Webhook URL:** a webhook that should receive the export download link

The export is asynchronous. When the export is ready, Insider posts the download link to the webhook URL. Note that the link expires 24 hours after delivery.

### Honor a GDPR deletion request

1. Trigger the workflow from any source (e.g. a form submission, a webhook from your support system).
2. Add the **Insider One** node and configure:
   - **Resource:** `Data Governance`
   - **Operation:** `Delete User Profile` (or `Delete User's PII Data` to anonymize without deleting the profile)
   - **Identifiers → Email Address:** `{{ $json.email }}`

These operations are irreversible. Consider gating them behind an approval step.

## Compatibility

This package targets the n8n community node API v1 (`n8nNodesApiVersion: 1`) and is published with provenance via GitHub Actions. It works on both self-hosted n8n and (once verified) on n8n Cloud.

## Resources

- [Insider One API documentation](https://academy.insiderone.com/docs/insider-one-apis)
- [Insider One API reference](https://academy.insiderone.com/docs/api-reference-welcome)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
