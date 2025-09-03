# 🌐 Hands On: MCP Workshop

## Welcome to Step 7: Customize Your MCP Server with AI Assistance

### Concepts You'll Learn

- **AI-Assisted Development**: Using AI tools to accelerate coding
- **MCP Tool Design Patterns**: Creating specialized tools beyond basic examples
- **Creative Problem Solving**: Turning ideas into technical implementations
- **API Integration Patterns**: Connecting your MCP server to external services

### Learning Objectives

By the end of this step, you'll be able to:

- Leverage AI tools like Claude Code or Cursor to accelerate development
- Design and implement custom MCP tools based on your own ideas
- Enhance existing tools with new features and capabilities
- Apply creative thinking to expand your MCP server's functionality
- Integrate with APIs and services that interest you

### Implementation

In this final step, we'll explore how to use AI tools to extend and customize your MCP server. This is your opportunity to make the project your own by adding features and capabilities that interest you.

1. Choose an AI-assisted coding tool:

- **Claude Code**: Anthropic's Claude Code interface (https://claude.ai/code)
- **Cursor**: AI-native code editor (https://cursor.sh/)
- **GitHub Copilot**: AI pair programmer in your IDE
- Or any other AI coding assistant you prefer

2. Generate ideas for your custom MCP tools

Here are some starter ideas to inspire you:

- **Weather Tool**: Create a tool that fetches weather data for a given location
- **Translation Tool**: Build a tool that translates text between languages
- **Image Generation**: Integrate with image generation APIs for creative applications
- **Web Scraper**: Create a tool that extracts information from websites
- **Finance Tool**: Build a tool that fetches stock prices or currency exchange rates
- **Knowledge Base**: Create a persistent Q&A system using KV storage
- **Personal Assistant**: Enhance the todo app with reminders and priorities
- **Game Tool**: Create a simple game like Rock-Paper-Scissors or Hangman

3. Plan your custom tool's implementation

Use your AI assistant to plan the implementation:

```
Prompt example: "I want to create a weather tool for my MCP server that fetches
weather data for a city. The tool should accept a city name and return the current
temperature, conditions, and forecast. Help me design and implement this tool."
```

4. Implement your custom tool with AI assistance

Work with your AI coding assistant to:

- Design the tool's parameter schema using Zod
- Structure the appropriate API calls
- Format the response for AI consumption
- Add proper error handling

5. Test and iterate on your custom tool

Deploy your updated MCP server and test your new tool:

```bash
npm run deploy
```

Connect to it in the Cloudflare AI Playground and test your new functionality.

6. Share your creation!

We'd love to see what you build:

- Share your custom tools on social media with #AItoTheWorld
- Submit a pull request to the workshop repository with your custom tool
- Document your implementation and share it with the community

## Example: Weather Tool Implementation

Here's an example of how you might implement a weather tool with AI assistance:

```javascript
// Weather tool
this.server.tool(
  "getWeather",
  "Gets the weather for a given city",
  {
    city: z.string().describe("City name to get weather for"),
    units: z
      .enum(["metric", "imperial"])
      .default("metric")
      .describe("Temperature units (metric or imperial)"),
  },
  async ({ city, units }, env) => {
    try {
      // You would need to sign up for a free API key from a service like OpenWeatherMap
      const API_KEY = "your_api_key"; // In production, use environment variables or secrets
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      const weather = {
        city: data.name,
        country: data.sys.country,
        temperature: `${Math.round(data.main.temp)}${
          units === "metric" ? "°C" : "°F"
        }`,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${data.wind.speed}${units === "metric" ? " m/s" : " mph"}`,
      };

      const formattedResponse = `
🌤️ Weather for ${weather.city}, ${weather.country}

🌡️ Temperature: ${weather.temperature}
☁️ Conditions: ${weather.description}
💧 Humidity: ${weather.humidity}
💨 Wind: ${weather.windSpeed}
`;

      return { content: [{ type: "text", text: formattedResponse }] };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting weather: ${error.message}. Please try a different city.`,
          },
        ],
      };
    }
  },
  {
    description: "Get current weather conditions for a city",
  }
);
```

## Tips for AI-Assisted Development

1. **Be specific in your prompts**: Clearly describe what you want to build, including:

   - The tool's purpose and parameters
   - Expected input and output format
   - Any specific APIs or services to integrate with
   - Error handling requirements

2. **Iterate on the AI's suggestions**: Don't expect perfect code on the first try:

   - Review the generated code carefully
   - Ask for explanations of unfamiliar parts
   - Request specific improvements or alterations
   - Break complex tasks into smaller steps

3. **Learn from the process**: Use this as a learning opportunity:

   - Ask the AI to explain design decisions
   - Request alternative implementations
   - Explore best practices for the specific APIs you're using

4. **Test thoroughly**: Always test the generated code:
   - Check edge cases (empty inputs, error conditions)
   - Verify API responses are handled correctly
   - Test error handling paths

Congratulations on completing the AI to the World MCP Workshop! You've built a fully functional MCP server with custom tools and learned how to extend it with AI assistance. We can't wait to see what you build next!

## Show Us What You've Built!

- Share on Twitter/X with #AItoTheWorld
- Post in the Cloudflare Discord community
- Create a blog post or tutorial about your custom tool
- Submit a pull request to the workshop repository
- We have a new dedicated workshop site: https://learnmcp.examples.workers.dev/
