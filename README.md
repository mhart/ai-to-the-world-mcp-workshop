# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 4

1) Deploy your MCP Server to Cloudflare Workers

```bash
cd my-mcp-server
npm run deploy
```

This will deploy your MCP server to a Cloudflare Workers URL like:
`https://remote-mcp-server-authless.<your-account>.workers.dev/sse`

Make sure to copy this URL - you'll need it in the next step!

2) Test your deployed MCP server using Cloudflare AI Playground

- Go to https://playground.ai.cloudflare.com/
- Click on "Connect to a remote MCP server"
- Enter your deployed MCP server URL from the previous step
- Click "Connect"

3) Test each of your tools

The Cloudflare AI Playground provides a user-friendly interface to interact with your MCP tools:

- Click on the "Tools" button to see all available tools
- Test the "add" tool by providing two numbers
- Test the "randomNumber" tool and observe the true randomness from drand
- Test the "calculate" tool with different operations

4) Connect to your deployed MCP server from other clients

You can also connect to your MCP server from Claude Desktop:

- Follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user)
- In Claude Desktop go to Settings > Developer > Edit Config
- Update with this configuration, using your deployed URL:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://remote-mcp-server-authless.<your-account>.workers.dev/sse"
      ]
    }
  }
}
```

- Restart Claude and you should see your tools available

Congratulations! You've built and deployed a fully functional MCP server with custom tools that can be accessed from various AI assistants.
