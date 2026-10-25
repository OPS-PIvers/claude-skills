# figure-to-3d

A Claude skill that turns a photo of a textbook or manual figure into an interactive 3D model for teaching. See
`SKILL.md` for how it works and `specs/figure-to-3d.md` (repo root) for the design and the reasons behind it.

```
npm ci                                                        # once
node scripts/build.mjs assets/examples/heart.scene.js heart.html
node scripts/verify.mjs heart.html                            # shots in heart.shots/
```

## Files

- `assets/engine.js`: `mountModel()`, the look, controls and teaching layer. Its header lists every scene option.
- `assets/examples/heart.scene.js`: the reference scene (anatomy, meshes).
- `assets/examples/trumpet.scene.js`: the machine reference (procedural parts, pistons that move).
- `assets/examples/gears.scene.js`: a machine that runs (meshing gears, Run/Stop, speed, live readouts).
- `assets/examples/solid.scene.js`: math (sliders that rebuild a cone from a spun triangle, live volumes).
- `scripts/fetch-mesh.mjs`, `scripts/prep-mesh.mjs`: find raw meshes and clean them into the mesh library
  (`mesh-library/` at the repo root).
- `scripts/build.mjs`: one self-contained HTML page. `F3D_DEBUG=1` adds a source map for debugging.
- `scripts/verify.mjs`: screenshots and checks.

## Credits

- [three.js](https://threejs.org) (MIT), bundled into every page, including its OrbitControls, GLTFLoader,
  OutlineEffect and meshopt decoder.
- Build tools: [glTF Transform](https://gltf-transform.dev) (MIT), [meshoptimizer](https://github.com/zeux/meshoptimizer)
  (MIT), [esbuild](https://esbuild.github.io) (MIT), Draco decoder (Apache 2.0).
- Meshes carry their own licenses and credits in `mesh-library/manifest.json`, and every page lists the ones it uses.
  The heart is from [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html),
  © The Database Center for Life Science, CC BY 4.0.
- The teaching layer (caption rules, Predict, Walk through, Take apart, Present) follows the `ops-figures` skill.
