# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 1

1) Clone the Authless MCP Server Starter Tempalte

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

2) Run this MCP Server locally

You can start your MCP Server by running the following command:
```bash
npm start
```

3) Test your MCP Server using MCP inspector

To test your MCP Server, you can use the MCP inspector:
```bash
npx @modelcontextprotocol/inspector
```

* Visit the inspector at [http://127.0.0.1:6274](http://127.0.0.1:6274).
* Select "SSE" as the Transport Type
* Enter http://localhost:8787/sse in the URL box and select "Connect"
* Click "List Tools" to view tools our MCP Server has made available to us
* Click the "add" tool and test it out!
