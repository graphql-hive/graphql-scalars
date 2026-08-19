import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

export default defineConfig(({ mode }) => {
  const graphqlPackage = mode ?? 'graphql';

  return {
    resolve: {
      alias: [
        { find: /^graphql$/, replacement: require.resolve(graphqlPackage) },
        {
          find: /^graphql\/language$/,
          replacement: require.resolve(`${graphqlPackage}/language`),
        },
        {
          find: /^graphql\/type\/definition$/,
          replacement: require.resolve(`${graphqlPackage}/type/definition`),
        },
      ],
    },
    test: {
      environment: 'node',
      globals: true,
      include: ['tests/**/*.test.ts'],
      server: graphqlPackage !== 'graphql' ? { deps: { inline: true } } : undefined,
    },
  };
});
