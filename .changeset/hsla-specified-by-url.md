---
'graphql-scalars': patch
---

Expose the `@specifiedBy` URL on the `HSLA` scalar so it matches its sibling `HSL`. Both now point to the same MDN reference and emit the `@specifiedBy` directive in the schema.
