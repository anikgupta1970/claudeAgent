import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, 'prompt.txt'), 'utf-8');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function createMcpServer() {
  const server = new Server(
    { name: 'banking-journey-builder', version: '1.0.0' },
    {
      capabilities: { tools: {} },
      instructions:
        'Welcome to the Fixed Deposit Journey Builder by API Banking!\n\n' +
        'I can help you build a complete Open FD onboarding journey for existing bank customers.\n\n' +
        'What I can do:\n' +
        '  • Build the full 5-step FD journey (Login → Deposit Details → Bank Details → Preview → Success)\n' +
        '  • Generate correct Stitch API payloads for FD form submission\n' +
        '  • Answer questions about FD-specific API schemas and validation rules\n\n' +
        'To get started: "Build an Open FD journey for an existing customer"',
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'banking_assistant',
        description:
          'Build banking onboarding UI journeys and generate correct Stitch API payloads. ' +
          'Use for: building FD/SA/customer onboarding journeys, generating form payloads, ' +
          'answering Stitch API schema questions, instruction types, section types, and config management.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description:
                'Your request — e.g. "build an Open FD journey for existing customer" or ' +
                '"generate a Stitch form payload to open a savings account for a new customer"',
            },
          },
          required: ['query'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== 'banking_assistant') {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    const { query } = request.params.arguments;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: query }],
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    return {
      content: [{ type: 'text', text }],
    };
  });

  return server;
}

const app = express();
app.use(express.json());

const transports = new Map();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'banking-journey-builder' });
});

app.get('/setup', (_req, res) => {
  const baseUrl = 'https://claudeagent-production-fb05.up.railway.app';

  const mcpJson = JSON.stringify({ mcpServers: { 'banking-agent': { type: 'http', url: `${baseUrl}/mcp` } } }, null, 2);
  const settingsJson = JSON.stringify({
    companyAnnouncements: [
      'Welcome to the Fixed Deposit Journey Builder by API Banking!\n\nI can help you build a complete Open FD onboarding journey for existing bank customers.\n\nWhat I can do:\n  - Build the full 5-step FD journey (Login > Deposit Details > Bank Details > Preview > Success)\n  - Generate correct Stitch API payloads for FD form submission\n  - Answer questions about FD-specific API schemas and validation rules\n\nTo get started, type:\n  Build an Open FD journey for an existing customer',
    ],
  }, null, 2);

  const script = `#!/bin/bash
set -e

echo ""
echo "Setting up Fixed Deposit Journey Builder by API Banking..."
echo ""

mkdir -p .claude

cat > .mcp.json << 'EOF'
${mcpJson}
EOF

cat > .claude/settings.json << 'EOF'
${settingsJson}
EOF

echo "Done! Two files created:"
echo "  .mcp.json              — connects to the banking agent"
echo "  .claude/settings.json  — shows welcome message on session start"
echo ""
echo "Now restart Claude Code in this directory."
echo "Your first message: Build an Open FD journey for an existing customer"
echo ""
`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(script);
});

app.get('/mcp', async (req, res) => {
  const transport = new SSEServerTransport('/mcp/message', res);
  const mcpServer = createMcpServer();

  transports.set(transport.sessionId, transport);
  res.on('close', () => transports.delete(transport.sessionId));

  await mcpServer.connect(transport);
});

app.post('/mcp/message', async (req, res) => {
  const { sessionId } = req.query;
  const transport = transports.get(sessionId);

  if (!transport) {
    return res.status(404).json({ error: 'Session not found' });
  }

  await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Banking Journey Builder MCP server running on port ${PORT}`);
});
