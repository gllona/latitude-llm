import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  sourcemap: false,
  clean: true,
  dts: false,
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  loader: {
    // Tsup complains .html has no loader. But we don't have any .html files
    // So we just tell it to ignore it using 'empty' loader
    '.html': 'empty',
  },
  external: [
    'fs',
    'path',
    'os',
    'crypto',
    'hono',
    'jet-paths',
    '@hono/node-server',
    '@hono/zod-validator',
    'zod',
    'dotenv',
    '@faker-js/faker',
    '@ai-sdk/anthropic',
    '@ai-sdk/azure',
    '@ai-sdk/mistral',
    '@ai-sdk/openai',
    'ai',
    'argon2',
    'pg',
    'drizzle-kit',
    'drizzle-orm',
    'uuid',
    'lodash-es',
    '@t3-oss/env-core',
    'code-red',
    'locate-character',
    'acorn',
    'yaml',
    'bullmq',
    'ioredis',
  ],
  noExternal: [
    '@latitude-data/env',
    '@latitude-data/compiler',
    '@latitude-data/core',
    '@latitude-data/jobs',
  ],
})