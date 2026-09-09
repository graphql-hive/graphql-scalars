# GraphQL Scalars docs

The documentation at [the-guild.dev/graphql/scalars](https://the-guild.dev/graphql/scalars) is
authored here and rendered by [the-guild-org/website](https://github.com/the-guild-org/website),
which fetches this folder at build time. Nothing in this folder is built or deployed on its own.

## Layout

| Path       | What it is                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `content/` | The documentation, one folder per section (docs ). Folder order and titles come from each folder's `meta.json`. |
| `assets/`  | Images referenced from pages as `/assets/...`.                                                                  |

The `/changelog` page is rendered from `CHANGELOG.md`; nothing to maintain here.

## Writing pages

- Frontmatter: `title` (required) and `description`. The site renders the title as the page heading,
  so pages do not start with an `# H1`. Use `sidebarTitle` when the sidebar should show a shorter
  label.
- Ordering: each folder's `meta.json` lists `pages` in display order; a folder's `title` is its
  sidebar label. Pages not listed are built but hidden from the sidebar.
- Components available without importing: `Callout`, `Tabs` / `Tabs.Tab`, `Cards`, `FileTree`. Name
  code blocks with ` ```ts title="example.ts" `, and use ` ```sh npm2yarn ` for install commands.
- Links between pages are root-relative to this product: `/docs/...`.

## Previewing changes

Every same-repository pull request that touches this folder gets a preview at
`https://scalars-pr-<number>.guild-dev-website.pages.dev/graphql/scalars` (linked in a PR comment
within about ten minutes). Merges to `master` redeploy the live docs automatically.
