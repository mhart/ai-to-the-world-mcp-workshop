# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- **Dev Server**: `npm run dev` (in my-mcp-server directory)
- **Deploy**: `npm run deploy` (deploys to Cloudflare Workers)
- **Type Generation**: `npm run cf-typegen` (generates Cloudflare Worker types)
- **Lint/Format**: `npx biome check --apply` (checks and fixes code)
- **Test**: `npx @modelcontextprotocol/inspector` (test MCP endpoint at http://127.0.0.1:6274)

## Code Style Guidelines
- **Formatting**: 4 spaces indentation, 100 character line width
- **Imports**: Organized imports (sorted by path)
- **Types**: Strict TypeScript typing required for all functions and variables
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error Handling**: Use try/catch with proper error typing
- **MCP Tools**: Define tools using `this.server.tool(...)` pattern in src/index.ts

## Project Structure
- MCP server built with Cloudflare Workers
- Tools defined in src/index.ts with proper input/output schemas
- Uses ModelContextProtocol for structured tool definition