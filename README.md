# 🌐 AI to the World: MCP Workshop

## Welcome to Step 5: Setting Up Cloudflare KV Storage

### Concepts You'll Learn
- **Persistence in Serverless**: How to add state to stateless environments
- **Key-Value Storage**: Understanding KV storage patterns and use cases
- **Configuration Binding**: Connecting Cloudflare KV to your Workers environment
- **TypeScript Type Declarations**: Adding proper types for external services

### Learning Objectives
By the end of this step, you'll be able to:
- Create and configure a Cloudflare KV namespace
- Add storage capabilities to your MCP server
- Update TypeScript definitions to maintain type safety with KV
- Test basic read/write operations with persistent storage
- Troubleshoot common KV configuration issues

### Implementation

In this step, we'll add persistent storage capabilities to our MCP server by setting up Cloudflare KV (Key-Value) storage. This will allow our tools to remember information between sessions.

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

2) Add the KV namespace to your wrangler.jsonc file

Open `wrangler.jsonc` and uncomment/update the KV namespace configuration from the previous step:

```jsonc
"kv_namespaces": [
	{ "binding": "TODO_STORE", "id": "abcdef123456" }
],
```

Note: Replace the commented section in your wrangler.jsonc with the actual configuration and ID from the wrangler output.

3) Update worker-configuration.d.ts with the KV type

Open `worker-configuration.d.ts` and modify the Env interface to include the KV binding:

```typescript
interface Env {
    TODO_STORE: KVNamespace;
}
```

4) Create a simple test tool to verify KV is working

Open `src/index.ts` and add this simple test tool inside the `init()` method:

```javascript
// Simple KV test tool
this.server.tool(
    "storeValue",
    { 
        key: z.string().describe("Key to store the value under"),
        value: z.string().describe("Value to store")
    },
    async ({ key, value }, env) => {
        try {
            // Store value in KV
            await env.TODO_STORE.put(key, value);
            
            return { 
                content: [{ 
                    type: "text", 
                    text: `✅ Stored value "${value}" under key "${key}"` 
                }] 
            };
        } catch (error) {
            return { content: [{ type: "text", text: `Error storing value: ${error.message}` }] };
        }
    },
    {
        description: "Store a simple key-value pair in Cloudflare KV"
    }
);
```

5) Deploy your MCP server with the new KV binding

```bash
npm run deploy
```

6) Test your KV storage with Cloudflare AI Playground

- Go to https://playground.ai.cloudflare.com/ 
- Connect to your deployed MCP server URL
- Try the storeValue tool with a simple key and value (e.g., key="test", value="Hello KV!")

Congratulations! You've successfully set up Cloudflare KV storage for your MCP server. In the next step, we'll build a complete todo list application using this persistent storage.

## Troubleshooting

### KV namespace creation errors
- Make sure you're logged in to Cloudflare: `npx wrangler whoami`
- If not logged in, run: `npx wrangler login`
- Try creating the namespace with a different name if there's a conflict
- Verify you have appropriate permissions on your Cloudflare account

### Environment errors when using KV
- Check that you properly added the KV binding to wrangler.jsonc
- Verify the binding name matches exactly: `TODO_STORE`
- Make sure you updated the worker-configuration.d.ts file with the KV type
- The binding ID must match the one provided when you created the namespace

### "TypeError: env.TODO_STORE is undefined"
- This usually means the KV binding isn't correctly set up
- Double-check your wrangler.jsonc configuration
- Make sure you've deployed the worker after adding the KV binding
- Try running with `npx wrangler dev --local` to test locally first