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

## Continuation, 2026-10-10

- The added baked-dough base colour, normal and roughness maps (`baked_*`) are deterministic original procedural textures authored by `tools/modeling/build_scenes.py`. No external photograph or downloaded texture was added. Dark cloth reuses the authored linen maps with a separate PBR tint.
- The revised doorway boards, felt hems, roof geometry, cushions, garment shell, headscarf and eyebrow meshes are original generated geometry in the same Python source. The anatomical core remains the attributed MPFB CC0 asset above.
- The Asar assembly follows the visible sequence in [UNESCO's 2014 Mangistau photo series](https://ich.unesco.org/en/10-representative-list-00748?id=00998&include=slideshow_inc.php) as a contemporary educational interpretation. The source does not establish this model's dimensions, period, ornament placement or garment accuracy.
- The Nauryz yurt deliberately omits a front wall and roof sector as an educational cutaway. It is not a finished intact dwelling. [Kazakhstan's Nauryz overview](https://www.gov.kz/memleket/entities/digital-nauryz/press/article/details/225645?lang=kk) notes regional variation in kozhe ingredients; this scene is one illustrative arrangement.
- The tusaukeser cord and path are consistent with one version documented by [Kazakhstan's traditions portal](https://oq.gov.kz/abai/saltdasturler). The character handling and scissors motion remain unfinished and must not be interpreted as a procedure demonstration.
- Browser captures and their limited measurements are recorded in `docs/validation/browser/`; the broader quality limitations are in `docs/3D_CONTINUATION_REPORT_KK.md`.

## Six additional custom scenes, 2026-10-11

- `besikke-salu.glb`, `betashar.glb`, `syrga-salu.glb`, `bata-beru.glb`, `shashu.glb`, and `qymyzmuryndyq.glb` are generated from `tools/modeling/build_additional_scenes.py`, which imports the original authored mesh and rig helpers from `build_scenes.py`. Editable `.gltf` and `.bin` files sit beside the existing three in `tools/modeling/scenes/`.
- All new cradle, dombra, jewelry, vessels, sweets, rugs, garments and stage geometry is authored procedurally in that Python file. The bodily topology, age morphs and 53-bone weights reuse the MPFB CC0 source described above. No external 3D prop, photo or texture was downloaded or embedded.
- Wood, felt, fabric, skin and leather maps reuse the deterministic authored texture sets. New tinted metal, fabric and leather materials use authored factors and some reuse those maps. They are illustrative, not scans or calibrated PBR captures.
- Source and interpretation choices for every custom are recorded in `docs/ADDITIONAL_SCENE_SPECS_KK.md`. Relevant first-party sources include UNESCO's Betashar listing, Kazakhstan's National Museum besik inventory, the Akyn Sara museum cradle catalogue, and Kazakhstan government descriptions of syrga salu, bata beru, shashu and qymyzmuryndyq. We did not copy their photographs or claim museum approval.
- The clean gallery preview PNGs `public/assets/scene_*.png` and QA images `docs/validation/browser/*stage*.png` are direct browser captures of this application's 3D renderer. They are not generative reference images. No `.blend` file exists because Blender was unavailable.
