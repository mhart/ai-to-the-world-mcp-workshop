# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 5

In this step, we'll add persistent storage to our MCP server using Cloudflare KV. We'll build a simple todo list that can be used by AI assistants to remember tasks for users.

1) Create a KV namespace using Wrangler

```bash
cd my-mcp-server
npx wrangler kv:namespace create "TODO_STORE"
```

This will output something like:
```
🌀 Creating namespace with title "my-mcp-server-TODO_STORE"
✨ Success! Created namespace with ID "abcdef123456"
Add the following to your wrangler.toml:
kv_namespaces = [
	{ binding = "TODO_STORE", id = "abcdef123456" }
]
```

2) Add the KV namespace to your wrangler.toml file

Open `wrangler.toml` and add the KV namespace configuration from the previous step:

```toml
kv_namespaces = [
	{ binding = "TODO_STORE", id = "abcdef123456" }
]
```

3) Update worker-configuration.d.ts with the KV type

Open `worker-configuration.d.ts` and modify the Env interface to include the KV binding:

```typescript
interface Env {
    TODO_STORE: KVNamespace;
}
```

4) Add the Todo tools to your MCP server

Open `src/index.ts` and add the following tools inside the `init()` method:

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
```

5) Deploy your MCP server with the new tools

```bash
npm run deploy
```

6) Test your Todo tools using Cloudflare AI Playground

- Go to https://playground.ai.cloudflare.com/ 
- Connect to your deployed MCP server URL (e.g., `https://remote-mcp-server-authless.<your-account>.workers.dev/sse`)
- Try each tool:
  - addTodo: Add tasks like "Buy groceries" or "Finish workshop"
  - listTodos: See your pending and completed tasks
  - completeTodo: Mark tasks as completed

Congratulations! You've created a persistent todo list using Cloudflare KV. This demonstrates how you can use Cloudflare's platform features to add powerful capabilities to your MCP tools.

## Troubleshooting

### KV namespace creation errors
- Make sure you're logged in to Cloudflare: `npx wrangler whoami`
- If not logged in, run: `npx wrangler login`
- Try creating the namespace with a different name if there's a conflict
- Verify you have appropriate permissions on your Cloudflare account

### Environment errors when using KV
- Check that you properly added the KV binding to wrangler.toml
- Verify the binding name matches exactly: `TODO_STORE`
- Make sure you updated the worker-configuration.d.ts file with the KV type
- The binding ID must match the one provided when you created the namespace

### "TypeError: env.TODO_STORE is undefined"
- This usually means the KV binding isn't correctly set up
- Double-check your wrangler.toml configuration
- Make sure you've deployed the worker after adding the KV binding
- Try running with `npx wrangler dev --local` to test locally first

### Issues with task persistence
- If tasks aren't being saved, check that the KV operations are working
- Test with simple key-value pairs before implementing the full todo functionality
- Verify the key and value formats in your KV.put() operations
- Check for any errors in the catch blocks of your tool implementations

### "Cannot find namespace with ID" error
- Make sure the namespace ID in wrangler.toml matches the one from KV creation
- Try listing your namespaces with: `npx wrangler kv:namespace list`
- If the namespace doesn't exist, recreate it
- Ensure you're using the same Cloudflare account that created the namespace
