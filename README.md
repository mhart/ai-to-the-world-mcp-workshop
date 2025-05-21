# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop!

In this workshop, we'll be building and deploying an MCP server with useful tools. You can work through each step by changing branches in this repo.

## Prerequisites

Before starting this workshop, please ensure you have the following installed:

- **Node.js** (version 18 or later) - [Download](https://nodejs.org/)
- **Wrangler CLI** - Install with `npm install -g wrangler`
- **A Cloudflare account** - [Sign up](https://dash.cloudflare.com/sign-up) (free tier is sufficient)
- **Git** - [Download](https://git-scm.com/downloads)

You'll also need a text editor or IDE of your choice (VS Code recommended).

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/rickyrobinett/ai-to-the-world-mcp-workshop.git
   cd ai-to-the-world-mcp-workshop
   ```

2. Navigate between steps using Git:
   ```bash
   # For step 1
   git checkout step1
   
   # For step 2
   git checkout step2
   
   # And so on...
   ```

3. Follow the instructions in the README.md for each step

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

## Additional Resources

- [Model Context Protocol (MCP) Documentation](https://modelcontextprotocol.io/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare AI Playground](https://playground.ai.cloudflare.com/)
- [Claude Documentation](https://docs.anthropic.com/claude/)
