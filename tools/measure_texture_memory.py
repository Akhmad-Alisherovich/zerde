"""Estimate uncompressed RGBA texture storage from embedded GLB images.

This is a CPU-side theoretical estimate, not measured device GPU allocation.
"""
import json
import struct
from io import BytesIO
from pathlib import Path
from PIL import Image

results=[]
for path in sorted(Path('public/models').glob('*.glb')):
    data=path.read_bytes()
    json_len, json_type=struct.unpack_from('<II',data,12)
    assert json_type == 0x4E4F534A
    doc=json.loads(data[20:20+json_len])
    bin_offset=20+json_len+8
    memory=0
    for image in doc.get('images',[]):
        view=doc['bufferViews'][image['bufferView']]
        offset=bin_offset+view.get('byteOffset',0)
        with Image.open(BytesIO(data[offset:offset+view['byteLength']])) as bitmap:
            w,h=bitmap.size
        # Approximate full mip chain, rounded to nearest byte.
        memory+=round(w*h*4*4/3)
    results.append({'scene':path.stem,'embeddedImages':len(doc.get('images',[])),
                    'estimatedRgbaMipBytes':memory})
out=Path('docs/validation/texture-memory-estimates.json')
out.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
