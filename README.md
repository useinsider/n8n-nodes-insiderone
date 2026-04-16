# n8n-nodes-insiderone

An [n8n](https://n8n.io/) community node package that integrates with [Insider One](https://insiderone.com/). It enables seamless data flow between n8n workflows and Insider — covering the full range of [Insider One APIs](https://academy.insiderone.com/docs/insider-one-apis), from user data unification to contact management and data governance.

---

## Installation

If you already have an n8n instance, go to **Settings → Community Nodes**, click **Install**, and enter:

```
n8n-nodes-insiderone
```

For self-hosted n8n via npm:

```bash
npm install n8n-nodes-insiderone
```

---

## Running with Docker

```bash
# First run — build and start
docker compose up --build

# Subsequent runs
docker compose up

# After a code update
git pull
docker compose up --build
```

n8n will be accessible at `http://localhost:5678`.

---

## License

[MIT](LICENSE.md)
