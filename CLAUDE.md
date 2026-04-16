# InsiderOne n8n Community Node

An n8n community node package that integrates with Insider One APIs. It allows n8n workflows to create/update user profiles, query user data, export raw data, and manage data governance (e.g. email unsubscribe) via Insider's Unification and Contact APIs.

## Project Structure

```
nodes/InsiderOne/
├── InsiderOne.node.ts              # Main node — operation router, execute loop, batch logic
├── InsiderOne.node.json            # Codex metadata
├── insiderone.svg                  # Node icon (also copied to credentials/)
├── shared/
│   └── utils.ts                    # parseJsonParameter(), BASE_URL constant
└── resources/
    ├── userData/
    │   ├── index.ts                # Operation dropdown + re-exports
    │   ├── upsert.properties.ts    # UI field definitions
    │   ├── upsert.execute.ts       # API call logic
    │   ├── getProfile.properties.ts
    │   ├── getProfile.execute.ts
    │   ├── export.properties.ts
    │   ├── export.execute.ts
    │   └── GUIDE.md                # userData operation reference
    └── dataGovernance/
        ├── index.ts
        ├── unsubscribeEmail.properties.ts
        └── unsubscribeEmail.execute.ts

credentials/
├── InsiderOneApi.credentials.ts    # X-PARTNER-NAME + X-REQUEST-TOKEN headers
└── insiderone.svg                  # Icon copy required by n8n
```

## How It Works

### Node Entry Point
`InsiderOne.node.ts` defines the node. It spreads all resource properties into the `properties` array and routes each operation to its handler via `operationRouter`. The upsert operation has special batch logic — multiple input items can be grouped into a single API call based on `Batch Size`.

### Resources and Operations
Each resource lives in its own directory under `resources/`. Every operation has two files:
- `<op>.properties.ts` — `INodeProperties[]` array defining all UI fields with `displayOptions`
- `<op>.execute.ts` — async handler function that reads parameters and calls the API

The resource's `index.ts` defines the operation dropdown and re-exports everything.

### Authentication
Credentials are defined in `InsiderOneApi.credentials.ts`. All API calls use `this.helpers.httpRequestWithAuthentication('insiderOneApi', ...)` which injects `X-PARTNER-NAME` and `X-REQUEST-TOKEN` headers automatically.

### API Base URLs
- Unification APIs (upsert, getProfile, export): `BASE_URL` = `https://unification.useinsider.com`
- Contact APIs (unsubscribeEmail): `https://contact.useinsider.com`

## Commands

- `npm run build` — compile TypeScript
- `npm run lint` — run n8n linter
- `npm run dev` — build + start n8n locally with this node
