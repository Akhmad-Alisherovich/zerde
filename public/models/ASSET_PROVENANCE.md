# Zerde 3D asset provenance

These are editable educational reconstruction drafts, not scanned museum objects or measurements of one historically documented yurt. No museum-quality approval is claimed.

- Authored yurt, vessels, food, rope, scissors, terrain and garment surfaces: `tools/modeling/build_scenes.py` in this repository. All geometry is stored in the GLB files; the application does not build cultural objects from Three.js primitive geometries.
- Anatomical topology, three phenotype/age morphs, 53-bone rig definitions and skin weights: official MPFB core data, CC0. Source and exact revision are recorded in `tools/modeling/vendor/mpfb/SOURCE.txt`. The original asset license and attribution header are retained. No MPFB application code is copied.
- License evidence: https://static.makehumancommunity.org/mpfb/faq/build_other_chargen.html and https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.ASSETS.md . Only the anatomical core inherits the CC0 dedication; no license is inferred for the original website or its pre-existing illustrations.
- Base-colour, normal and metallic/roughness maps: deterministic authored procedural textures. These are not photographs, photogrammetry or measured skin/cloth scans. Base colour is 512 px JPEG; normal and metallic/roughness maps are 256 px PNG, embedded in each GLB and supplied separately.
- UV orientation and vertex tangents: MikkTSpace through its MIT-licensed npm package.
- Structural references: UNESCO's documentation of yurt construction and the Kazakhstan National Museum inventory, https://ich.unesco.org/en/RL/traditional-knowledge-and-skills-in-making-kyrgyz-kazakh-and-karakalpak-yurts-turkic-nomadic-dwellings-02284 and https://nmrk.kz/en/structure/scientific-activity/national-list/695/ . Referenced images were not downloaded into the models and do not imply museum endorsement.
- The existing website's 2D reference illustrations are retained with explicit 2D labels. They do not count as newly created 3D models. No new Nano Banana image was generated.

Import `tools/modeling/scenes/*.gltf` together with the adjacent `.bin` into Blender or another glTF editor to modify the full authoring scenes. The `.glb` files are the optimized runtime exports. No `.blend` file is available because Blender could not be installed in this execution environment.
