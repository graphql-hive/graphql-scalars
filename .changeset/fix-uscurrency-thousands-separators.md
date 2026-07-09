---
'graphql-scalars': patch
---

Fix `USCurrency` parsing of amounts with more than one thousands separator

`generateCents` stripped only the first comma, so a value like `$1,000,000.00` parsed to the wrong
amount (`parseFloat` stopped at the second separator, yielding `$1,000.00`). It now removes every
separator.
