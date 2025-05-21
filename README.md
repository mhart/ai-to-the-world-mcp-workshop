# 🌐 AI to the World: MCP Workshop

## Welcome to Step 3: Enhanced Random Number with Cloudflare drand

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

## Troubleshooting

### Network errors when calling drand endpoint
If you get errors accessing the drand API:
- Check your internet connection
- Verify the URL is correct: https://drand.cloudflare.com/public/latest
- The fallback to Math.random() should handle any API issues automatically

### JSON parsing errors
- Make sure you're correctly handling the response with `await response.json()`
- Check the structure of the data object by adding a console.log(data)
- Verify that the randomness property exists on the data object

### Issues with the parseInt function
- Verify you're slicing the hex string correctly: `randomHex.slice(0, 8)`
- Make sure you're using parseInt with the hex base: `parseInt(hex, 16)`
- Check that Math.abs() is being applied to handle potentially negative values

### Scaled random number outside the expected range
- Double-check the scaling formula: `Math.abs(randomValue) % (b - a + 1) + a`
- Verify that the parameters `a` and `b` are being passed correctly
- Add console.log statements to debug the values at each step
