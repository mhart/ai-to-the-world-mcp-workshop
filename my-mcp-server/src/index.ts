import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "AI to the World MCP Workshop",
		version: "1.0.0",
		description: "A collection of useful tools including a true random number generator powered by drand",
	});
	async init() {

		// Random number tool
		this.server.tool(
			"randomNumber",
			"Generate a random number between a and b",
			{ a: z.number().describe("The minimum value of the range"), b: z.number().describe("The maximum value of the range") },
			async ({ a, b }) => {
				try {
					// Get true randomness from drand Cloudflare endpoint
					const response = await fetch("https://drand.cloudflare.com/public/latest");
					const data = await response.json();
					
					// Use the randomness value as seed
					// Take a random 8-character slice from the full randomness string
					const randomHex = data.randomness;
					const startIndex = Math.floor(Math.random() * (randomHex.length - 8));
					const randomValue = parseInt(randomHex.slice(startIndex, startIndex + 8), 16);
					
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
		
		// Simple addition tool
		this.server.tool(
			"add",
			"Add two numbers together",
			{ a: z.number().describe("The first number"), b: z.number().describe("The second number") },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			})
		);

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
			"Perform a mathematical operation on two numbers",
			{
				operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The operation to perform"),
				a: z.number().describe("The first number"),
				b: z.number().describe("The second number"),
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

