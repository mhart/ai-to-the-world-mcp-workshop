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
    // Weather tool
    this.server.tool(
      "getWeather",
      "Gets the weather for a particular city",
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
            windSpeed: `${data.wind.speed}${
              units === "metric" ? " m/s" : " mph"
            }`,
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
