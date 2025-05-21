# ai-to-the-world-mcp-workshop

## Welcome to the AI to the World MCP Workshop! Step 3

1) Open your MCP Server code in your IDE of choice

2) Navigate to src/index.ts

3) Enhance the randomNumber tool to use the drand Cloudflare endpoint

```javascript
this.server.tool(
    "randomNumber",
    { a: z.number(), b: z.number() },
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
```

4) Test your enhanced tool using MCP inspector

```bash
npx @modelcontextprotocol/inspector
```

* Visit the inspector at [http://127.0.0.1:6274](http://127.0.0.1:6274).
* Select "SSE" as the Transport Type
* Enter http://localhost:8787/sse in the URL box and select "Connect"
* Click "List Tools" to view tools our MCP Server has made available to us
* Click the "randomNumber" tool and test it out!
