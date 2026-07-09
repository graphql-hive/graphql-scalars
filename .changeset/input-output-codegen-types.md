---
'graphql-scalars': minor
---

Emit distinct input/output codegen types for scalars whose parsed and returned types differ

Scalars whose parsed **input** type is narrower than the accepted resolver-return **output** type
now declare `codegenScalarType` as `{ input, output }`, so graphql-code-generator emits the two
positions separately instead of collapsing them into one union:

- `DateTime` / `Date` / `Time` / `Timestamp` — `input` is `Date`; `output` accepts a `Date` or an
  ISO string (plus a unix `number` for `DateTime`/`Timestamp`)
- `Byte` — `input` is `Buffer`; `output` accepts `Buffer | string`
- `URL` — `input` is `URL`; `output` accepts `URL | string`
- `BigInt` — `input` is `bigint | number`; `output` accepts `bigint | number | string`
- `Port` / `Latitude` / `Longitude` — `input` is `number`; `output` accepts `string | number`

(`DateTimeISO` and `Long` inherit their base configs.)

Requires a version of `@graphql-codegen/typescript` whose `visitor-plugin-common` understands the
object form of `codegenScalarType` (graphql-code-generator#10893). Older versions read the extension
as a single string and will not handle the object form.
