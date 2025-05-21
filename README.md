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

Each step includes a detailed troubleshooting section to help you overcome common issues.

## Workshop Steps

### Step 1: Getting Started with MCP Server
Learn the fundamentals of MCP and how AI assistants can use external tools to enhance their capabilities.

### Step 2: Adding Custom Tools
Discover how to extend AI capabilities by creating your own custom tools that solve specific problems.

### Step 3: Enhanced Random Number with Cloudflare drand
Integrate with external APIs to give AI assistants access to powerful services beyond their training data.

### Step 4: Deploying and Using with Cloudflare AI Playground
Make your tools accessible anywhere by deploying to the cloud and connecting to real AI assistants.

### Step 5: Adding Persistence with Cloudflare KV
Enable stateful applications by adding memory to your AI tools, allowing assistants to remember information between sessions.

## Additional Resources

- [Model Context Protocol (MCP) Documentation](https://modelcontextprotocol.io/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare AI Playground](https://playground.ai.cloudflare.com/)
- [Claude Documentation](https://docs.anthropic.com/claude/)
