import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const GetWeatherSchema = z.object({
  city: z.string(),
});

const server = new Server(
  {
    name: "fatihlovestosimplify-weather-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// list all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-weather",
        description: "get weather info",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "name of the city (e.g istanbul)",
            },
          },
          required: ["city"],
        },
      },
    ],
  };
});

// tool body
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get-weather") {
      const { city } = GetWeatherSchema.parse(args);
      const reqUrl = `${process.env.WEATHER_API_BASE_URL}?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`;

      const data = await fetch(reqUrl);

      if (!data.ok) {
        return {
          content: [
            {
              type: "text",
              text: "some error",
            },
          ],
        };
      }

      const jsonData = (await data.json()) as any;

      return {
        content: [
          {
            type: "text",
            text: `${city} için sıcaklık değeri anlık: ${jsonData.current.temp_c}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: "unknown tool",
          },
        ],
      };
    }
  } catch (error) {
    const err = error as any;

    throw new Error(err.message);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
