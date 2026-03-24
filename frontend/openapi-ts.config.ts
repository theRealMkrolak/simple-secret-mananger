import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: {
    path: './src/client',
  },
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/schemas',
    {
      name: '@hey-api/sdk',
    },
    {
        name: '@hey-api/typescript',
        enums: 'javascript',
    },
    {
        name: 'zod',
    }
  ],
});
