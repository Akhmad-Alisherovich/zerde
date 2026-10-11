"""Print world-space rest joint positions for close-range contact review."""
import json
import sys
from pathlib import Path

import numpy as np

scene = sys.argv[1] if len(sys.argv) > 1 else 'betashar'
doc = json.loads((Path(__file__).parent / 'scenes' / f'{scene}.gltf').read_text())
nodes = doc['nodes']
parents = {child: index for index, node in enumerate(nodes) for child in node.get('children', [])}


def rotation(q):
    x, y, z, w = q
    return np.array([
        [1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)],
        [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)],
        [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)],
    ])


for label in sys.argv[2:] or ['akyn-hand_l', 'akyn-hand_r']:
    index = next(i for i, node in enumerate(nodes) if node['name'] == label)
    chain = [index]
    while index in parents:
        index = parents[index]
        chain.append(index)
    transform = np.eye(4)
    for index in reversed(chain):
        node = nodes[index]
        local = np.eye(4)
        local[:3, :3] = rotation(node.get('rotation', [0, 0, 0, 1]))
        local[:3, 3] = node.get('translation', [0, 0, 0])
        transform = transform @ local
    print(label, np.round(transform[:3, 3], 3))
