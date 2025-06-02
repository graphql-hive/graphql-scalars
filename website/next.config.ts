import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  output: 'export',
  env: {
    SITE_URL: 'https://the-guild.dev/graphql/scalars',
  },
  nextraConfig: {
    contentDirBasePath: '/docs',
  },
  redirects: async () =>
    Object.entries({
      '/docs/introduction': '/docs',
      '/docs/scalars': '/docs/scalars/account-number',
      '/en/docs/scalars/:scalar': '/docs/scalars/:scalar',
      '/docs/scalars/datetime': '/docs/scalars/date-time',
      '/docs/scalars/jsonobject': '/docs/scalars/json-object',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
