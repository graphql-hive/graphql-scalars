---
'graphql-scalars': patch
---

`HSL`, `HSLA` and `RGBA` no longer accept an arbitrary character in place of the decimal point
(`hsl(1a5, 50%, 50%)`, `rgba(1, 2, 3, 1x5)`). The pattern now matches a literal `.`, as `RGB`
already does.
