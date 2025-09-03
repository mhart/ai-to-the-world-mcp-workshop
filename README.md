# 🌐 Hands On: MCP Workshop

## Welcome to Step 1: Getting Started with MCP Server

### Concepts You'll Learn

- **Model Context Protocol (MCP)**: The open standard that allows AI assistants to use external tools
- **Server-Client Architecture**: How MCP servers communicate with AI assistants
- **Tool Definition Pattern**: The structure and components of a basic MCP tool
- **Local Development Flow**: Setting up and testing a Cloudflare Workers development environment

### Learning Objectives

By the end of this step, you'll be able to:

- Set up a functional MCP server using Cloudflare Workers
- Understand the basic structure of an MCP server
- Test your MCP tools using the inspector interface
- Connect your deployed MCP server to the Cloudflare AI Playground
- Troubleshoot common setup and connection issues

### Implementation

1. Create a new MCP Server using the Cloudflare template

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

2. Navigate to the project directory

```bash
cd my-mcp-server
```

3. Run this MCP Server locally

You can start your MCP Server by running the following command:

```bash
npm start
```

4. Test your MCP Server using MCP inspector

To test your MCP Server, you can use the MCP inspector in a new terminal:

```bash
npx @modelcontextprotocol/inspector
```

- Visit the inspector at the URL it gives you, which looks like `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=abcd1234`.
- Select "Streamable HTTP" as the Transport Type
- Enter `http://localhost:8787/mcp` in the URL box and select "Connect"
- Click "List Tools" to view tools our MCP Server has made available to us
- Click the "add" tool and test it out!

5. Test your new tool using Cloudflare's AI Playground

- Go to https://playground.ai.cloudflare.com/
- Enter http://localhost:8787/mcp in the MCP Server URL under "MCP Servers"
- Click "Connect"
- Enter "Add 2 + 4 together using our add MCP tool" as a User message and click
  "Run"

## Troubleshooting

### "Port 8787 is already in use"

If you receive an error that port 8787 is already in use:

```bash
npx wrangler dev --port 8788
```

Then update the URL in the inspector to http://localhost:8788/mcp

### "Cannot connect to MCP server"

- Make sure your MCP server is running (npm start)
- Check that you entered the URL correctly: http://localhost:8787/mcp
- Try refreshing the inspector page

### Inspector loads but no tools appear

- Check your terminal for any errors in the server logs
- Verify that the URL is correct: http://localhost:8787/mcp
- Make sure you clicked "Connect" before trying to list tools

### Playground can't connect

- Click `Clear stored authentication` and reload the page
- Verify that the URL is correct: http://localhost:8787/mcp
