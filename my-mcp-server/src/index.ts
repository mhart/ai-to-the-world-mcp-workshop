import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "AI to the World MCP Workshop",
		version: "1.0.0",
		description: "A collection of useful tools including a true random number generator powered by drand",
	});

	async init() {
		// Simple addition tool
		this.server.tool(
			"add",
			{ 
				a: z.number().describe("First number to add"), 
				b: z.number().describe("Second number to add")
			},
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			}),
			{
				description: "Simple addition of two numbers"
			}
		);

		this.server.tool(
			"randomNumber",
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
			},
			{
				description: "Generate a truly random number using Cloudflare's drand service"
			}
		);

		// Calculator tool with multiple operations
		this.server.tool(
			"calculate",
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
			},
			{
				description: "Perform various mathematical operations on two numbers"
			}
		);

		// Add Todo tool
		this.server.tool(
			"addTodo",
			{ 
				task: z.string().describe("Task description to add to your todo list")
			},
			async ({ task }, env) => {
				try {
					// Store task in KV with the task description as the key
					await env.TODO_STORE.put(task, JSON.stringify({
						completed: false,
						createdAt: new Date().toISOString()
					}));
					
					return { 
						content: [{ 
							type: "text", 
							text: `✅ Added task: "${task}"` 
						}] 
					};
				} catch (error) {
					return { content: [{ type: "text", text: `Error adding task: ${error.message}` }] };
				}
			},
			{
				description: "Add a new task to your todo list"
			}
		);

		// List Todos tool
		this.server.tool(
			"listTodos",
			{},
			async (_, env) => {
				try {
					// Get all tasks from KV
					const { keys } = await env.TODO_STORE.list();
					
					if (keys.length === 0) {
						return { content: [{ type: "text", text: "No tasks found in your todo list" }] };
					}
					
					// Get all task data
					const tasks = await Promise.all(
						keys.map(async (key) => {
							const data = await env.TODO_STORE.get(key.name, "json");
							return { 
								task: key.name, 
								completed: data.completed 
							};
						})
					);
					
					// Group tasks by completion status
					const completedTasks = tasks.filter(t => t.completed);
					const pendingTasks = tasks.filter(t => !t.completed);
					
					let taskList = "📋 TODO LIST\n\n";
					
					if (pendingTasks.length > 0) {
						taskList += "Pending Tasks:\n";
						pendingTasks.forEach(t => {
							taskList += `• ${t.task}\n`;
						});
						taskList += "\n";
					}
					
					if (completedTasks.length > 0) {
						taskList += "Completed Tasks:\n";
						completedTasks.forEach(t => {
							taskList += `✓ ${t.task}\n`;
						});
					}
					
					return { content: [{ type: "text", text: taskList }] };
				} catch (error) {
					return { content: [{ type: "text", text: `Error listing tasks: ${error.message}` }] };
				}
			},
			{
				description: "List all tasks in your todo list"
			}
		);

		// Complete Todo tool
		this.server.tool(
			"completeTodo",
			{ 
				task: z.string().describe("The task to mark as completed")
			},
			async ({ task }, env) => {
				try {
					// Check if task exists
					const taskData = await env.TODO_STORE.get(task, "json");
					
					if (!taskData) {
						return { content: [{ type: "text", text: `Task "${task}" not found` }] };
					}
					
					// Mark as completed
					taskData.completed = true;
					await env.TODO_STORE.put(task, JSON.stringify(taskData));
					
					return { 
						content: [{ 
							type: "text", 
							text: `✅ Marked task "${task}" as completed` 
						}] 
					};
				} catch (error) {
					return { content: [{ type: "text", text: `Error completing task: ${error.message}` }] };
				}
			},
			{
				description: "Mark a task as completed in your todo list"
			}
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
