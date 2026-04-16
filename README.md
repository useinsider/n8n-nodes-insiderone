# n8n-nodes-insiderone

An [n8n](https://n8n.io/) community node package that integrates with [Insider One](https://insiderone.com/). It enables seamless data flow between n8n workflows and Insider — covering the full range of [Insider One APIs](https://academy.insiderone.com/docs/insider-one-apis), from user data unification to contact management and data governance.

---

## Installation

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-insiderone
```

Or install via npm in a self-hosted environment:

```bash
npm install n8n-nodes-insiderone
```

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Build and start n8n locally with this node loaded
npm run start

# Watch mode (TypeScript only)
npm run build:watch

# Lint
npm run lint
npm run lint:fix
```

---

## License

[MIT](LICENSE.md)
