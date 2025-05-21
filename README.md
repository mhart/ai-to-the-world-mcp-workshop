# 🌐 AI to the World: MCP Workshop

## Welcome to the AI to the World MCP Workshop!

The Model Context Protocol (MCP) is an open standard that allows AI assistants to use external tools and access real-time information. By building an MCP server, you enable AI systems like Claude to extend their capabilities through your custom tools, creating more powerful AI agents.

In this workshop, we'll be building and deploying an MCP server with useful tools. You can work through each step by changing branches in this repo.

## Prerequisites

Before starting this workshop, please ensure you have the following installed:

- **Node.js** (version 18 or later) - [Download](https://nodejs.org/)
- **Wrangler CLI** - Install with `npm install -g wrangler`
- **A Cloudflare account** - [Sign up](https://dash.cloudflare.com/sign-up) (free tier is sufficient)
- **Git** - [Download](https://git-scm.com/downloads)

You'll also need a text editor or IDE of your choice (VS Code recommended).

**Optional:**
- **Claude Desktop** - [Download](https://claude.ai/desktop) - Only needed for Step 4's optional integration. The workshop can be completed using just the Cloudflare AI Playground.

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
Discover how to extend AI capabilities by creating your own custom tools that solve specific problems. We'll create a randomNumber tool that AI assistants can use for games, simulations, and unpredictable outcomes.

### Step 3: Enhanced Random Number with Cloudflare drand
Integrate with external APIs to give AI assistants access to powerful services beyond their training data.

### Step 4: Deploying and Using with Cloudflare AI Playground
Make your tools accessible anywhere by deploying to the cloud and connecting to real AI assistants. We'll use the Cloudflare AI Playground for testing, with an optional section on Claude Desktop integration.

### Step 5: Setting Up Cloudflare KV Storage
Learn how to add persistent storage to your MCP server using Cloudflare KV. We'll set up the infrastructure needed for stateful applications.

### Step 6: Building a Persistent Todo App
Build a complete todo list application that maintains state between conversations, allowing AI assistants to remember tasks for users.

### Step 7: Customize Your MCP Server with AI Assistance
Use AI tools like Claude Code or Cursor to create your own custom MCP tools, connecting to APIs and services that interest you. This step encourages creative exploration and showcases how AI can accelerate your development workflow.

## Additional Resources

- [Model Context Protocol (MCP) Documentation](https://modelcontextprotocol.io/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Cloudflare AI Playground](https://playground.ai.cloudflare.com/)
- [Claude Documentation](https://docs.anthropic.com/claude/)

## Community & Support

We'd love to hear about what you build or help with any questions!

- **Discord**: Join the [Cloudflare Developers Discord](https://discord.com/invite/cloudflaredev)
- **Forums**: Post on the [Cloudflare Community Forums](https://community.cloudflare.com/)
- **GitHub**: Report issues or contribute at [Cloudflare AI GitHub](https://github.com/cloudflare/ai)
- **Twitter**: Follow [@CloudflareDev](https://twitter.com/CloudflareDev) for updates
