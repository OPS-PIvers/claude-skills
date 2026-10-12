---
name: typescript-best-practices
description: TypeScript type-design rules that make illegal states unrepresentable: discriminated unions, branded IDs, no `as` casts, `unknown` at boundaries, schema-derived types, exhaustive switches, `satisfies`. Use when writing, editing, or reviewing any .ts or .tsx file, designing types or props, or fixing type errors.
paths: ["**/*.ts", "**/*.tsx"]
---

# TypeScript best practices

The goal is that the compiler, not a reviewer, catches the mistake. Agents copy the nearest example and take the shortest path that compiles, so make the shortest path the correct one. The language-agnostic reasoning is in the "Type discipline" section of `engineering-principles`.

| Rule | Summary |
| --- | --- |
| Discriminated unions | Model variants with a `kind` literal discriminant so impossible states can't be represented. No bags of optional fields. |
| Branded types | Brand primitives with `& { readonly __brand: "X" }` so a `WidgetId` can't be passed where a `UserId` is expected. Validate once at the boundary. |
| Constructive modeling | Build the shape so the illegal value can't be constructed: `[T, ...T[]]` for non-empty, `[T, T][]` for pairs, `start` plus `duration` for a range. Not a runtime guard. |
| Simplest total type | Keep `T[]` while every operation on it is total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | External data (`JSON.parse`, fetch responses, Firestore document data, `postMessage`, localStorage, env vars) is `unknown` until parsed. |
| Schemas before guards | Before hand-writing a property-by-property type guard, use the repo's runtime schema library (Zod, Valibot) and infer the type from the schema. Don't add a schema library for one guard. |
| No `as` casts | Every `as` is a runtime crash waiting. Cast only after validation. |
| Narrowing hierarchy | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > `as`. |
| Type guards | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`. |
| Exhaustiveness | `const _exhaustive: never = x;` in `default` arms so adding a variant fails compilation at every switch that must handle it. |
| `satisfies` over `as` | Validates the value without widening literal types. Ideal for config objects and registries. |
| Boundary validation | Parse where data crosses in, into a named domain type. `Record<string, unknown>` stops at that parse. Trust types inside. |
| Derived types | Reach for `Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof`, `keyof typeof` before declaring a new interface. Derive unions from a registry object instead of maintaining a parallel list. |
| Object args | Pass objects, not positional args, so argument order is self-documenting. Skip on hot paths (per-frame render, tight loops). |
| Real tests | Don't mock what you can run. Verify UI in a running build. Mock only what you can't run locally. |
| No stray logging | No `console.log` in shipped code. Use the app's logger or structured errors with enough context to debug from an ID. |

Before writing a new pattern, check how the repo already does it and match it, unless the existing way breaks one of these rules; then say so rather than copying it.

Code examples for every rule: `references/patterns.md`.
