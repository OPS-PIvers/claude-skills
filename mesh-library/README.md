# Mesh library

Cleaned, compressed 3D meshes for the `figure-to-3d` skill, kept outside the plugin so installs stay small.

- One folder per group (`bp3d/heart/`): a `.glb` per part (centimetres, Y up, front toward +Z, meshopt-compressed)
  and the `recipe.json` that rebuilds them from the source files.
- `manifest.json`: every group's source, license and credit, and every mesh's file, triangles, bounds, centre and
  sha256. `build.mjs` reads it to inline meshes and write each page's credits.

Add or rebuild a group with the skill's scripts (run from `plugins/pauls-skills/skills/figure-to-3d/`):

```
node scripts/fetch-mesh.mjs get bp3d ../../../../mesh-library/bp3d/heart/recipe.json
node scripts/prep-mesh.mjs ../../../../mesh-library/bp3d/heart/recipe.json --src ~/.cache/figure-to-3d/raw
```

Only meshes whose license allows redistribution go here (CC0, CC BY, public domain), with the credit the license asks
for in the recipe's `source`.

| Group | Parts | Source | License |
|---|---|---|---|
| `bp3d/heart` | 16: chambers, valves, great vessels, coronary vessels | BodyParts3D 4.0 | CC BY 4.0 |
