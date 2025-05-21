# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop!

In this workshop, we'll be building and deploying an MCP server with useful tools. You can work through each step by changing branches in this repo.

## Workshop Steps

### Step 1: Getting Started with MCP Server
- Clone the Authless MCP Server Starter Template
- Run the MCP Server locally
- Test your MCP Server using the MCP inspector

### Step 2: Adding Custom Tools
- Add a randomNumber tool to the MCP Server
- Test your new tool with the MCP inspector

### Step 3: Enhanced Random Number with Cloudflare drand
- Use the Cloudflare drand endpoint for true randomness
- Implement error handling with fallback mechanism
- Test the enhanced tool with MCP inspector

### Step 4: Deploying and Using with Cloudflare AI Playground
- Deploy your MCP server to Cloudflare Workers
- Test your MCP server with Cloudflare AI Playground
- Add descriptions to improve tool discoverability
- Connect your deployed MCP server to Claude Desktop

### Step 5: Adding Persistence with Cloudflare KV
- Create a KV namespace using Wrangler
- Build a simple todo list with persistent storage
- Implement addTodo, listTodos, and completeTodo tools
- Test your KV-powered tools in the Cloudflare AI Playground
