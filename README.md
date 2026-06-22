<p align="center">
  <img src="https://github.com/user-attachments/assets/f890fc86-84c4-4a3f-9fcf-9dcea64bafa3" alt="Insider One"/>
</p>

# n8n-nodes-insiderone

An [n8n](https://n8n.io/) community node package that integrates with [Insider One](https://insiderone.com/). It enables seamless data flow between n8n workflows and Insider — covering the full range of [Insider One APIs](https://academy.insiderone.com/docs/insider-one-apis), from user data unification to data governance.

## Installation

In your n8n instance, go to **Settings → Community Nodes**, click **Install**, and enter:

```
@useinsider/n8n-nodes-insiderone
```

## Credentials

1. Log in to [Inone](https://inone.useinsider.com/).
2. Open **Settings → Integration Settings**.
3. Generate a **Unified Customer Database API Token**.
4. In n8n, create **Insider One Unification API** credentials, then enter your Inone Name and paste the API token.

## Operations

### User Data

| Operation | Description |
|-----------|-------------|
| **Create or Update** | Upsert a user profile with attributes and/or events. Supports batching of multiple input items into a single API call. |
| **Get User Profiles** | Query user profile information by identifier. Returns selected attributes and events. |
| **Update Identifiers** | Replace an existing identifier (e.g. email) with a new value. |
| **Delete Identifiers** | Remove one or more identifiers from a user profile. |
| **Delete User Attribute** | Remove specific attributes — fully or partial values — from a user profile. |
| **Export Raw Data** | Export segment data asynchronously in CSV, JSON, or Parquet format. |

### Data Governance

| Operation | Description |
|-----------|-------------|
| **Delete User Profile** | Permanently delete a user profile. |
| **Delete User's PII Data** | Anonymize a user's personally identifiable information. |

All operations support both a structured UI mode and a raw **JSON parameters** mode for advanced use cases. Identifiers (`email`, `uuid`, `phone_number`, `insider_id`, custom) can be combined as needed.

## Resources

- [Insider One](https://insiderone.com/)
- [Insider One API Reference](https://academy.insiderone.com/docs/api-reference-welcome)
- [n8n Documentation](https://docs.n8n.io/)

## Support

- [GitHub Issues](https://github.com/useinsider/n8n-nodes-insiderone/issues)

## License

[MIT](LICENSE.md)
