# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 2

1) Open your MCP Server code in your IDE of choice

2) Navigate to src/index.ts

3) Add a new random number tool

```javascript
this.server.tool(
    "randomNumber",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(Math.floor(Math.random() * (b - a + 1)) + a) }],
    })
);
```

4) Test your new tool using MCP inspector

```bash
npx @modelcontextprotocol/inspector
```

* Visit the inspector at [http://127.0.0.1:6274](http://127.0.0.1:6274).
* Select "SSE" as the Transport Type
* Enter http://localhost:8787/sse in the URL box and select "Connect"
* Click "List Tools" to view tools our MCP Server has made available to us
* Click the "randomNumber" tool and test it out!
