import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

interface Env {
	TODO_STORE: KVNamespace;
}

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "AI to the World MCP Workshop",
		version: "1.0.0",
		description: "A collection of useful tools including a true random number generator powered by drand",
	});

	async init() {
		this.server.tool(
			"storeValue",
			"Store a simple key-value pair in Cloudflare KV",
			{ 
				key: z.string().describe("Key to store the value under"),
				value: z.string().describe("Value to store")
			},
			async ({ key, value }) => {
				try {
					await this.env.TODO_STORE.put(key, value);
					
					return {
						content: [{ 
							type: "text", 
							text: "Value stored successfully" 
						}]
					};
				} catch (error: any) {
					console.error("Error storing value:", error);
					throw new Error(`Failed to store value: ${error?.message || 'Unknown error'}`);
				}
			}
		);

		// Simple addition tool
		this.server.tool(
			"add",
			"Simple addition of two numbers",
			{ 
				a: z.number().describe("First number to add"), 
				b: z.number().describe("Second number to add")
			},
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			})
		);

		this.server.tool(
			"randomNumber",
			"Generate a truly random number using Cloudflare's drand service",
			{ 
				a: z.number().describe("Minimum value (inclusive)"), 
				b: z.number().describe("Maximum value (inclusive)")
			},
			async ({ a, b }) => {
				try {
					// Get true randomness from drand Cloudflare endpoint
					const response = await fetch("https://drand.cloudflare.com/public/latest");
					const data = await response.json();
					
					// Use the randomness value as seed
					const randomHex = data.randomness;
					const randomValue = parseInt(randomHex.slice(0, 8), 16);
					
					// Scale to the requested range
					const scaledRandom = Math.abs(randomValue) % (b - a + 1) + a;
					
					return {
						content: [{ 
							type: "text", 
							text: String(scaledRandom)
						}],
					};
				} catch (error) {
					// Fallback to Math.random if fetch fails
					return {
						content: [{ 
							type: "text", 
							text: String(Math.floor(Math.random() * (b - a + 1)) + a) 
						}],
					};
				}
			}
		);

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
			"Perform various mathematical operations on two numbers",
			{
				operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("Mathematical operation to perform"),
				a: z.number().describe("First operand"),
				b: z.number().describe("Second operand"),
			},
			async ({ operation, a, b }) => {
				let result: number;
				switch (operation) {
					case "add":
						result = a + b;
						break;
					case "subtract":
						result = a - b;
						break;
					case "multiply":
						result = a * b;
						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
