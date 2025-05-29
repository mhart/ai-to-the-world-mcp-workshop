# 🌐 AI to the World: MCP Workshop

## Welcome to Step 2: Adding Custom Tools

### Concepts You'll Learn
- **Tool Schema Definition**: How to define parameters and validation using Zod
- **MCP Tool Architecture**: The three-part structure of MCP tools (name, schema, handler)
- **Async Handlers**: Creating asynchronous function handlers for MCP tools
- **Content Formatting**: How to structure responses for consistent AI consumption

### Learning Objectives
By the end of this step, you'll be able to:
- Create custom MCP tools with defined parameter schemas
- Implement a random number generator tool from scratch
- Format tool outputs in the MCP-compliant structure
- Test and validate custom tools using the MCP inspector

### Implementation

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

4) Test your new tool using Cloudflare's AI Playground

- Go to https://playground.ai.cloudflare.com/
- Enter http://localhost:8787/sse in the MCP Server URL under "MCP Servers"
- Click "Connect"
- Enter "Add 2 + 4 together using our add MCP tool" as a User message and click
  "Run"

## Troubleshooting

### "Cannot restart server" errors
If you get errors when trying to restart the server after code changes:
- Stop the server (Ctrl+C)
- Start it again with `npm start`

### Code changes don't appear
- Make sure you saved the file after making changes
- Check the terminal for any TypeScript compilation errors
- Restart the server if needed

### Syntax errors in the code
Common issues when adding the randomNumber tool:
- Missing commas between tool parameters
- Missing parentheses in the Math.random() expression
- Incorrect indentation (use tabs to match the project style)

### Tool not showing up in the inspector
- Make sure the server restarted successfully after your changes
- Disconnect and reconnect to the server in the inspector
- Check for any error messages in the terminal
