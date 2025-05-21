# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 1

1) Create a new MCP Server using the Cloudflare template

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

2) Navigate to the project directory

```bash
cd my-mcp-server
```

3) Run this MCP Server locally

You can start your MCP Server by running the following command:
```bash
npm start
```

4) Test your MCP Server using MCP inspector

To test your MCP Server, you can use the MCP inspector:
```bash
npx @modelcontextprotocol/inspector
```

* Visit the inspector at [http://127.0.0.1:6274](http://127.0.0.1:6274).
* Select "SSE" as the Transport Type
* Enter http://localhost:8787/sse in the URL box and select "Connect"
* Click "List Tools" to view tools our MCP Server has made available to us
* Click the "add" tool and test it out!

## Troubleshooting

### "Command not found: wrangler"
If you see this error, you need to install Wrangler globally:
```bash
npm install -g wrangler
```

### "Port 8787 is already in use"
If you receive an error that port 8787 is already in use:
```bash
npx wrangler dev --port 8788
```
Then update the URL in the inspector to http://localhost:8788/sse

### "Cannot connect to MCP server"
- Make sure your MCP server is running (npm start)
- Check that you entered the URL correctly: http://localhost:8787/sse
- Try refreshing the inspector page

### Inspector loads but no tools appear
- Check your terminal for any errors in the server logs
- Verify that the URL is correct: http://localhost:8787/sse
- Make sure you clicked "Connect" before trying to list tools
