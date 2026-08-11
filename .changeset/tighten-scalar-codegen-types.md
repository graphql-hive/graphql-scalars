---
'graphql-scalars': minor
---

Tighten scalar codegen types (#2554)

`codegenScalarType` now consistently carries each scalar's resolver-return (output) type, so
generated resolver types reflect what each scalar actually serializes and accepts:

- Enum scalars (CountryCode, Currency, CountryName) emit a string-literal union instead of `string`.
- USCurrency emits `number` — resolvers both return and receive cents as a number — instead of
  `string`.
- DateTime and BigInt widen to cover every value `serialize` accepts.

These are type-level changes only, with no change to runtime behavior. Consumers relying on the
previously looser types may see new — and correct — compile errors where a value was typed too
broadly before.
