# 🌐 AI to the World: MCP Workshop

## Welcome to Step 6: Building a Persistent Todo App

### Concepts You'll Learn
- **Stateful Application Design**: Building applications that remember context
- **JSON Data Serialization**: Storing structured data in KV storage
- **Data Fetching & Aggregation**: Retrieving and processing data from storage
- **UI Formatting for AI Consumption**: Formatting data for AI assistant display

### Learning Objectives
By the end of this step, you'll be able to:
- Implement a complete CRUD workflow with persistent storage
- Create tools that store and retrieve structured JSON data
- Design user-friendly formatting for task organization
- Process and aggregate data from multiple storage keys
- Build tools that maintain context between AI conversations

### Implementation

In this step, we'll build a complete todo list application using the Cloudflare KV storage we set up in the previous step. This will demonstrate how to create AI tools that maintain state between conversations.

1) Open your MCP Server code in your IDE of choice

2) Navigate to src/index.ts

3) Add the "addTodo" tool

```javascript
// Add Todo tool
    this.server.tool(
			"addTodo",
			"Add a new task to your todo list",
			{ 
				task: z.string().describe("Task description to add to your todo list")
			},
			async ({ task }) => {
				try {
					// Store task in KV with the task description as the key
					await this.env.TODO_STORE.put(task, JSON.stringify({
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
			}
		);
```

4) Add the "listTodos" tool

```javascript
// List Todos tool
this.server.tool(
			"listTodos",
			"List all tasks in your todo list",
			{},
			async (_) => {
				try {
					const { keys } = await this.env.TODO_STORE.list();
					
					if (keys.length === 0) {
						return { content: [{ type: "text", text: "No tasks found in your todo list" }] };
					}
										
					const values = await this.env.TODO_STORE.get(keys.map(k => k.name));

					const obj = Object.fromEntries(values);
					const jsonString = JSON.stringify(obj, null, 2);
					
					return { 
						content: [{ 
							type: "text", 
							text: jsonString
						}] 
					};
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					return { content: [{ type: "text", text: `Error listing tasks: ${errorMessage}` }] };
				}
			}
		);
```

5) Add the "completeTodo" tool

```javascript
// Complete Todo tool
        this.server.tool(
			"completeTodo",
			"Mark a task as completed in your todo list",
			{ 
				task: z.string().describe("The task to mark as completed")
			},
			async ({ task }) => {
				try {
					// Check if task exists
					const taskData = await this.env.TODO_STORE.get(task, "json");
					
					if (!taskData) {
						return { content: [{ type: "text", text: `Task "${task}" not found` }] };
					}
					
					// Mark as completed
					taskData.completed = true;
					await this.env.TODO_STORE.put(task, JSON.stringify(taskData));
					
					return { 
						content: [{ 
							type: "text", 
							text: `✅ Marked task "${task}" as completed` 
						}] 
					};
				} catch (error) {
					return { content: [{ type: "text", text: `Error completing task: ${error.message}` }] };
				}
			}
		);
```

6) Deploy your MCP server with the todo app tools

```bash
npm run deploy
```

7) Test your Todo app using Cloudflare AI Playground

- Go to https://playground.ai.cloudflare.com/ 
- Connect to your deployed MCP server URL
- Try each tool to create a complete workflow:
  - Use addTodo to create several tasks
  - Use listTodos to view your tasks
  - Use completeTodo to mark tasks as completed
  - Use listTodos again to verify the completed status

Congratulations! You've built a persistent todo list application using Cloudflare KV and MCP. This demonstrates how AI assistants can maintain state and remember information between conversations, creating more powerful and personalized experiences.

## Troubleshooting

### Issues with task persistence
- If tasks aren't being saved, check that the KV operations are working
- Verify the key and value formats in your KV.put() operations
- Make sure you're storing and retrieving JSON properly
- Check for any errors in the catch blocks of your tool implementations

### "Cannot find namespace with ID" error
- Make sure the namespace ID in wrangler.toml matches the one from KV creation
- Try listing your namespaces with: `npx wrangler kv:namespace list`
- If the namespace doesn't exist, recreate it
- Ensure you're using the same Cloudflare account that created the namespace

### Tasks not appearing in listTodos
- Verify that tasks were successfully added with addTodo
- Check for any error messages in the console logs
- Make sure you're not filtering out tasks accidentally
- Try adding a simple task with a distinctive name for testing
