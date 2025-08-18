# 🌐 AI to the World: MCP Workshop

## Welcome to Step 3: Enhanced Random Number with Cloudflare drand

### Concepts You'll Learn

- **External API Integration**: How to connect MCP tools to external services
- **True Randomness vs. Pseudo-randomness**: Understanding cryptographic randomness
- **Error Handling & Fallbacks**: Implementing robust tools with graceful degradation
- **Data Transformation**: Converting API responses into consistent tool outputs

### Learning Objectives

By the end of this step, you'll be able to:

- Integrate external APIs into your MCP tools using fetch
- Implement proper error handling with fallback mechanisms
- Process and transform binary data into usable formats
- Apply cryptographic randomness from Cloudflare drand to your applications

### Implementation

1. Open your MCP Server code in your IDE of choice

2. Navigate to src/index.ts

3. Enhance the randomNumber tool to use the drand Cloudflare endpoint

```javascript
// Random number tool
this.server.tool(
   "randomNumber",
   { startRange: z.number(), endRange: z.number() },
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
         const scaledRandom = (Math.abs(randomValue) % (endRange - startRange + 1)) + startRange;

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
                  Math.floor(Math.random() * (endRange - startRange + 1)) + startRange),
               },
            ],
         };
      }
   }
);
```

4. Test your enhanced tool using MCP inspector

```bash
npx @modelcontextprotocol/inspector
```

- Visit the inspector at [http://127.0.0.1:6274](http://127.0.0.1:6274).
- Select "Streamable HTTP" as the Transport Type
- Enter http://localhost:8787/mcp in the URL box and select "Connect"
- Click "List Tools" to view tools our MCP Server has made available to us
- Click the "randomNumber" tool and test it out!

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

- Verify you're slicing the hex string correctly: `randomHex.slice(startIndex, startIndex + 8)`
- Make sure you're using parseInt with the hex base: `parseInt(hex, 16)`
- Check that Math.abs() is being applied to handle potentially negative values

### Scaled random number outside the expected range

- Double-check the scaling formula: `Math.abs(randomValue) % (endRange - startRange + 1) + startRange`
- Verify that the parameters `startRange` and `endRange` are being passed correctly
- Add console.log statements to debug the values at each step
