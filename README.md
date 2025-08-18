# 🌐 AI to the World: MCP Workshop

## Welcome to Step 4: Deploying and Using with Cloudflare AI Playground

### Concepts You'll Learn

- **Tool Discovery & Documentation**: How to make tools self-documenting and discoverable
- **Cloud Deployment**: Deploying serverless MCP servers on Cloudflare Workers
- **AI Assistant Integration**: Connecting your MCP tools to real AI assistants
- **Cross-Platform Compatibility**: Making your tools work with different AI clients

### Learning Objectives

By the end of this step, you'll be able to:

- Add meaningful descriptions to tools and parameters for better discoverability
- Deploy your MCP server to the cloud using Cloudflare Workers
- Connect your deployed MCP server to the Cloudflare AI Playground
- Configure Claude Desktop to use your custom MCP tools
- Troubleshoot common deployment and connection issues

### Implementation

1. First, enhance your MCP server with better descriptions

Open `src/index.ts` and update your server configuration with a name and description:

```javascript
export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "AI to the World MCP Workshop",
		version: "1.0.0",
		description: "A collection of useful tools including a true random number generator powered by drand",
	});
```

2. Add descriptions to all your tools to improve discoverability

Update your tools to include parameter descriptions and tool descriptions:

```javascript
this.server.tool(
  "add",
  "Simple addition of two numbers",
  {
    a: z.number().describe("First number to add"),
    b: z.number().describe("Second number to add"),
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  })
);

this.server.tool(
  "randomNumber",
  "Generate a truly random number using Cloudflare's drand service",
  {
    startRange: z.number().describe("Minimum value (inclusive)"),
    endRange: z.number().describe("Maximum value (inclusive)"),
  }
  // ... implementation ...
);

this.server.tool(
  "calculate",
  "Perform various mathematical operations on two numbers",
  {
    operation: z
      .enum(["add", "subtract", "multiply", "divide"])
      .describe("Mathematical operation to perform"),
    a: z.number().describe("First operand"),
    b: z.number().describe("Second operand"),
  }
  // ... implementation ...
);
```

3. Deploy your MCP Server to Cloudflare Workers

```bash
npm run deploy
```

This will deploy your MCP server to a Cloudflare Workers URL like:
`https://my-mcp-server.<your-account>.workers.dev/mcp`

Make sure to copy this URL - you'll need it in the next step!

4. Test your deployed MCP server using Cloudflare AI Playground

- Go to https://playground.ai.cloudflare.com/
- Click on "Connect to a remote MCP server"
- Enter your deployed MCP server URL from the previous step
- Click "Connect"

5. Test each of your tools

The Cloudflare AI Playground provides a user-friendly interface to interact with your MCP tools:

- Click on the "Tools" button to see all available tools
- Test the "add" tool by providing two numbers
- Test the "randomNumber" tool and observe the true randomness from drand
- Test the "calculate" tool with different operations

6. Connect to your deployed MCP server from other clients

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
        "https://remote-mcp-server-authless.<your-account>.workers.dev/mcp"
      ]
    }
  }
}
```

- Restart Claude and you should see your tools available

Congratulations! You've built and deployed a fully functional MCP server with custom tools that can be accessed from various AI assistants.

## Troubleshooting

### Deployment errors

- Make sure you're in the correct directory (`cd my-mcp-server`)
- Check if you're logged in to Cloudflare: `npx wrangler whoami`
- If not logged in, run: `npx wrangler login`
- If you get build errors, check for syntax issues in your code

### "Error: Cannot find KV namespace binding" on deploy

- This can sometimes happen if you have KV bindings from step5
- Remove or comment out KV bindings in wrangler.toml for this step

### Can't connect to deployed MCP server in Playground

- Make sure you're using the full URL including `/mcp` at the end
- Verify your Cloudflare Worker was deployed successfully
- Check that you're using the correct account subdomain
- Try accessing the URL directly in your browser to see if it responds

### Tools not appearing in Cloudflare AI Playground

- Check that you clicked "Connect" before trying to list tools
- Make sure the URL is correct: `https://remote-mcp-server-authless.<your-account>.workers.dev/mcp`
- Try refreshing the page and reconnecting
- Check your browser's developer console for network errors

### Claude Desktop integration issues

- Make sure you've configured the Claude Desktop config correctly
- Check that you're using the proper URL format in the configuration
- Verify you've restarted Claude Desktop after making configuration changes
- Try "npx mcp-remote https://your-url.workers.dev/mcp" in a terminal to test the connection
