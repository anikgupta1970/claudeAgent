import { webcrypto } from 'crypto';
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import express from 'express';
import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));


const basePrompt = readFileSync(join(__dirname, 'prompt.txt'), 'utf-8');
const stitchSkill = readFileSync(join(__dirname, 'Stitch-Skill.md'), 'utf-8');
const uiSkillFD = readFileSync(join(__dirname, 'UI_SKILLS_FD.md'), 'utf-8');

function loadScaffolding(scaffoldingDir) {
  const entries = [];
  function walk(dir) {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.(tsx?|[sc]ss)$/.test(entry)) {
        const rel = full.replace(scaffoldingDir + '/', '');
        entries.push(`// ${rel}\n${readFileSync(full, 'utf-8')}`);
      }
    }
  }
  walk(scaffoldingDir);
  return entries.join('\n\n');
}

const scaffolding = loadScaffolding(join(__dirname, 'scaffolding'));

const SYSTEM_PROMPT = `${basePrompt}

---

# PART 1 — Stitch Backend Capabilities Reference

${stitchSkill}

---

# PART 2 — UI Skill: Banking Journey Builder (FD)

${uiSkillFD}

---

# PART 4 — App Scaffolding Templates

These are the canonical files for wiring a standalone Vite app. The scaffolding is organized into two directories:

- **shared/** — reusable across all flows: main.tsx, index.css, vite.config.ts, api/client.ts, and shared components (AppShell, Stepper, OtpInput, CardRadio, Modal, InfoBanner)
- **flows/open-fd/** — FD-specific: App.tsx, JourneyContext.tsx, types/index.ts, utils/tenure.ts, step components, and DebugPanel

When generating a new flow, copy the shared/ structure as-is and create a new flows/<flow-name>/ directory following the open-fd pattern.

Components are imported via the Vite aliases in vite.config.ts (e.g. \`@api-banking/design.actions.button\`). Do NOT use Bit workspace commands or raw Bit component IDs as import paths.

The API client in shared/api/client.ts makes all Stitch API calls. Always use its exported functions (findCustomer, getCustomerAccounts, getProductConfig, calculateFD, getBranches, getNomineeRelationships, submitForm, etc.) instead of writing raw fetch calls. The base URL is configured via the VITE_STITCH_API_BASE_URL environment variable, set to https://mahendra-shetake.mocks.apibanking.com.

IMPORTANT: Always include DebugPanel in every generated app — it is a must-have feature. It lives at src/components/DebugPanel/ and provides 4 tabs: App Logs (console intercept), Network (fetch intercept with request/response bodies), App Data (live JourneyContext state), and Pages (step progress). It is already wired into App.tsx.

${scaffolding}`;

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
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
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

app.all('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const mcpServer = createMcpServer();
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Banking Journey Builder MCP server running on port ${PORT}`);
});
