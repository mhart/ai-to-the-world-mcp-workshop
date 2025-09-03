# 🌐 Hands On: MCP Workshop

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

1. Open your MCP Server code in your IDE of choice

2. Navigate to src/index.ts

3. Add a new random number tool in the `init()` function (before the other tool definitions):

```javascript
// Random number tool
this.server.tool(
  "randomNumber",
  { startRange: z.number(), endRange: z.number() },
  async ({ startRange, endRange }) => ({
    content: [
      {
        type: "text",
        text: String(
          Math.floor(Math.random() * (endRange - startRange + 1)) + startRange
        ),
      },
    ],
  })
);
```

4. Test your new tool in the MCP Inspector

- Make sure the inspector is running as per the last step
- Click "List Tools"
- Click the "randomNumber" tool, enter a start and end, and test it out!

5. Test your new tool in the AI Playground

- Make sure your MCP server is set up on https://playground.ai.cloudflare.com/ as in the last step
- Enter "Generate a random number between 10 and 20" as a User message and click
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
