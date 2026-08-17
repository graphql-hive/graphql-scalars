---
'graphql-scalars': minor
---

Tighten scalar TypeScript and codegen types (#2554)

Every scalar now declares precise `GraphQLScalarType<TParsed, TSerialized>` generics, and
`codegenScalarType` consistently carries the resolver-return (output) type, so generated resolver
types reflect what each scalar actually parses and accepts:

- Enum scalars (CountryCode, Currency, CountryName) emit a string-literal union instead of `string`.
- USCurrency emits `number` — resolvers both return and receive cents as a number — instead of
  `string`.
- DateTime and BigInt widen to cover every value `serialize` accepts.
- Timestamp's jsonSchema type is corrected to `integer` to match its numeric wire value.

These are type-level changes only, with no change to runtime behavior. Consumers relying on the
previously looser types may see new — and correct — compile errors where a value was typed too
broadly before.
