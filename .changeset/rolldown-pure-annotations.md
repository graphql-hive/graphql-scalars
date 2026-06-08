---
'graphql-scalars': patch
---

Remove misplaced `/*#__PURE__*/` annotations that Rolldown reports as
`[INVALID_ANNOTATION]` (e.g. when bundling with Vite 6 / Rolldown). The
annotations were attached to object literals and regex literals, which
Rolldown ignores by spec — only annotations on call/`new` expressions are
honored. The valid `/*#__PURE__*/ new GraphQLScalarType(...)` annotations
are kept, so dead-code elimination is unchanged.
