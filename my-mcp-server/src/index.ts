import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "AI to the World MCP Workshop",
    version: "1.0.0",
    description:
      "A collection of useful tools including a true random number generator powered by drand",
  });

  async init() {
    // Add Todo tool
    this.server.tool(
      "addTodo",
      "Add a new task to your todo list",
      {
        task: z.string().describe("Task description to add to your todo list"),
      },
      async ({ task }) => {
        try {
          // Store task in KV with the task description as the key
          await this.env.TODO_STORE.put(
            task,
            JSON.stringify({
              completed: false,
              createdAt: new Date().toISOString(),
            })
          );

          return {
            content: [
              {
                type: "text",
                text: `✅ Added task: "${task}"`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error adding task: ${error}` }],
          };
        }
      }
    );

    // List Todos tool
    this.server.tool(
      "listTodos",
      "List all tasks in your todo list",
      {},
      async (_) => {
        try {
          const { keys } = await this.env.TODO_STORE.list();

          if (keys.length === 0) {
            return {
              content: [
                { type: "text", text: "No tasks found in your todo list" },
              ],
            };
          }

          const values = await this.env.TODO_STORE.get(keys.map((k) => k.name));

          const obj = Object.fromEntries(values);
          const jsonString = JSON.stringify(obj, null, 2);

          return {
            content: [
              {
                type: "text",
                text: jsonString,
              },
            ],
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: `Error listing tasks: ${error}` }],
          };
        }
      }
    );

    // Complete Todo tool
    this.server.tool(
      "completeTodo",
      "Mark a task as completed in your todo list",
      {
        task: z.string().describe("The task to mark as completed"),
      },
      async ({ task }) => {
        try {
          // Check if task exists
          const taskData: { completed: boolean } | null =
            await this.env.TODO_STORE.get(task, "json");

          if (!taskData) {
            return {
              content: [{ type: "text", text: `Task "${task}" not found` }],
            };
          }

          // Mark as completed
          taskData.completed = true;
          await this.env.TODO_STORE.put(task, JSON.stringify(taskData));

          return {
            content: [
              {
                type: "text",
                text: `✅ Marked task "${task}" as completed`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              { type: "text", text: `Error completing task: ${error}` },
            ],
          };
        }
      }
    );

    // Random number tool
    this.server.tool(
      "randomNumber",
      "Generate a truly random number using Cloudflare's drand service",
      {
        startRange: z.number().describe("Minimum value (inclusive)"),
        endRange: z.number().describe("Maximum value (inclusive)"),
      },
      async ({ startRange, endRange }) => {
        try {
          // Get true randomness from drand Cloudflare endpoint
          const response = await fetch(
            "https://drand.cloudflare.com/public/latest"
          );
          const data = (await response.json()) as { randomness: string };

          // Use the randomness value as seed
          // Take a random 8-character slice from the full randomness string
          const randomHex = data.randomness;
          const startIndex = Math.floor(Math.random() * (randomHex.length - 8));
          const randomValue = parseInt(
            randomHex.slice(startIndex, startIndex + 8),
            16
          );

          // Scale to the requested range
          const scaledRandom =
            (Math.abs(randomValue) % (endRange - startRange + 1)) + startRange;

          return {
            content: [
              {
                type: "text",
                text: String(scaledRandom),
              },
            ],
          };
        } catch (error) {
          // Fallback to Math.random if fetch fails
          return {
            content: [
              {
                type: "text",
                text: String(
                  Math.floor(Math.random() * (endRange - startRange + 1)) +
                    startRange
                ),
              },
            ],
          };
        }
      }
    );

    // Simple addition tool
    this.server.tool(
      "add",
      "Simple addition of two numbers",
      {
        a: z.number().describe("First number to add"),
        b: z.number().describe("Second number to add"),
      },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
      })
    );

    // Calculator tool with multiple operations
    this.server.tool(
      "calculate",
      "Perform various mathematical operations on two numbers",
      {
        operation: z
          .enum(["add", "subtract", "multiply", "divide"])
          .describe("Mathematical operation to perform"),
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
