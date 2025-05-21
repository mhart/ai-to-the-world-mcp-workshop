# 🌐 AI to the World: MCP Workshop

## Welcome to Step 6: Building a Persistent Todo App

In this step, we'll build a complete todo list application using the Cloudflare KV storage we set up in the previous step. This will demonstrate how to create AI tools that maintain state between conversations.

1) Open your MCP Server code in your IDE of choice

2) Navigate to src/index.ts

3) Add the "addTodo" tool

```javascript
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
```

4) Add the "listTodos" tool

```javascript
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
```

5) Add the "completeTodo" tool

```javascript
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