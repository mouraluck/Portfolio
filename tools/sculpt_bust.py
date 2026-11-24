"""Sculpt a 2.5D bust depth map from one frontal photo.

Inputs: the photo, its cutout (alpha = person mask) and Apple Vision face landmarks.
Output: src/assets/bust.png (R = relative albedo, G/B = 16-bit depth, A = mask)
        src/assets/bust.json (depth scale and rotation pivot)

Run:  uv run --with numpy --with scipy --with pillow --with scikit-image tools/sculpt_bust.py PHOTO CUTOUT LANDMARKS OUT_DIR [PREVIEW_DIR]
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage, sparse
from scipy.sparse.linalg import spsolve
from skimage import exposure

photo_p, cutout_p, lm_p, out_dir = map(Path, sys.argv[1:5])
preview_dir = Path(sys.argv[5]) if len(sys.argv) > 5 else None

rgb = np.asarray(Image.open(photo_p).convert("RGB"), dtype=np.float32) / 255
alpha = np.asarray(Image.open(cutout_p).convert("RGBA"), dtype=np.float32)[..., 3] / 255
lm = json.loads(lm_p.read_text())
H, W = alpha.shape
mask = ndimage.binary_opening(alpha > 0.5, iterations=2)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

P = lambda k: np.array(lm[k], dtype=np.float32)
pupL, pupR = P("leftPupil")[0], P("rightPupil")[0]
E = float(np.linalg.norm(pupR - pupL))  # eye distance: the unit for every measurement below
eye_mid = (pupL + pupR) / 2
nose = P("nose")
crest = P("noseCrest")
tip = np.array([eye_mid[0], nose[:, 1].max() - 0.12 * E])
mouth = P("outerLips").mean(0)
contour = P("faceContour")
chin = contour[np.argmax(contour[:, 1])]


def gauss(c, sx, sy=None):
    sy = sx if sy is None else sy
    return np.exp(-(((xx - c[0]) / sx) ** 2 + ((yy - c[1]) / sy) ** 2) / 2)


def seg_dist(a, b):
    ab = b - a
    t = np.clip(((xx - a[0]) * ab[0] + (yy - a[1]) * ab[1]) / max(1e-6, ab @ ab), 0, 1)
    return np.hypot(xx - (a[0] + t * ab[0]), yy - (a[1] + t * ab[1])), t


def smax(a, b, k):
    m = np.maximum(a, b)
    return m + k * np.log(np.exp((a - m) / k) + np.exp((b - m) / k))


def inflate(region, scale=2):
    """Smooth dome over a silhouette: solve -lap(u) = 1 inside, u = 0 outside, return sqrt(u)."""
    small = np.asarray(Image.fromarray(region.astype(np.uint8) * 255).resize((W // scale, H // scale), Image.BILINEAR)) > 127
    h, w = small.shape
    idx = -np.ones(small.shape, dtype=np.int64)
    idx[small] = np.arange(small.sum())
    n = int(small.sum())
    rows, cols, vals = [], [], []
    ys, xs = np.nonzero(small)
    for k in range(n):
        y, x = ys[k], xs[k]
        rows.append(k); cols.append(k); vals.append(4.0)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            j = idx[y + dy, x + dx] if 0 <= y + dy < h and 0 <= x + dx < w else -1
            if j >= 0:
                rows.append(k); cols.append(j); vals.append(-1.0)
    A = sparse.csr_matrix((vals, (rows, cols)), shape=(n, n))
    u = np.zeros(small.shape, dtype=np.float32)
    u[small] = spsolve(A, np.ones(n))
    u = np.sqrt(np.maximum(u, 0))
    up = np.asarray(Image.fromarray(u).resize((W, H), Image.BILINEAR))
    return up / max(1e-6, up.max()) * region


# --- coarse volumes ---------------------------------------------------------
head_region = mask & (yy < chin[1] + 0.05 * E)
body_region = mask & ~head_region
head = inflate(head_region) * 1.35 * E
body = inflate(body_region) * 0.95 * E

# --- facial sculpt (all in units of E) --------------------------------------
face = np.zeros_like(head)
face_c = np.array([eye_mid[0], eye_mid[1] + 0.5 * E])
r2 = ((xx - face_c[0]) / (1.1 * E)) ** 2 + ((yy - face_c[1]) / (1.5 * E)) ** 2
# near-vertical face plane from hairline to chin, so the profile doesn't recede like a dome
front = 1.3 * E * np.clip(1 - r2, 0, 1) ** 0.6

for pup in (pupL, pupR):
    face -= 0.20 * E * gauss(pup + [0, -0.04 * E], 0.30 * E, 0.24 * E)  # eye socket
    face += 0.09 * E * gauss(pup, 0.15 * E, 0.11 * E)  # eyeball
    out = 1 if pup[0] > eye_mid[0] else -1
    face += 0.12 * E * gauss(pup + [out * 0.25 * E, 0.55 * E], 0.32 * E, 0.22 * E)  # cheekbone

for brow in (P("leftEyebrow"), P("rightEyebrow")):
    for a, b in zip(brow[:-1], brow[1:]):
        d, _ = seg_dist(a + [0, 0.05 * E], b + [0, 0.05 * E])
        face += 0.035 * E * np.exp(-((d / (0.13 * E)) ** 2) / 2)

# nose: ridge rising from between the eyes to the tip, then tip and wings
top = np.array([eye_mid[0], crest[:, 1].min() - 0.05 * E])
d, t = seg_dist(top, tip)
ridge = (0.05 + 0.17 * t**1.4) * E * np.exp(-((d / ((0.09 + 0.05 * t) * E)) ** 2) / 2)
face += ridge
face += 0.10 * E * gauss(tip, 0.15 * E, 0.13 * E)
for sx in (nose[:, 0].min(), nose[:, 0].max()):
    face += 0.10 * E * gauss([sx, tip[1] + 0.02 * E], 0.11 * E, 0.09 * E)
face -= 0.03 * E * gauss([eye_mid[0], tip[1] + 0.2 * E], 0.35 * E, 0.08 * E)  # under-nose shadow

face += 0.08 * E * gauss(mouth, 0.42 * E, 0.17 * E)  # lips
face -= 0.03 * E * gauss(P("innerLips").mean(0), 0.25 * E, 0.04 * E)
face += 0.06 * E * gauss(chin + [0, -0.22 * E], 0.30 * E, 0.20 * E)  # chin
face -= 0.07 * E * gauss(chin + [0, -0.48 * E], 0.30 * E, 0.07 * E)  # chin crease

# --- texture-driven relief: hair curls and small forms ----------------------
luma = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
fm = mask.astype(np.float32)
local = ndimage.gaussian_filter(luma * fm, 22) / np.maximum(1e-4, ndimage.gaussian_filter(fm, 22))
rel = np.clip(luma / np.maximum(1e-3, local), 0, 2) * fm

# tone: the photo itself, prepared for 1-bit dots. Adaptive equalization lifts the dark skin and
# hair without flattening them, then a stretch over the subject sets black and white points.
clahe = exposure.equalize_adapthist(luma, kernel_size=int(1.2 * E), clip_limit=0.012)
lo, hi = np.percentile(clahe[mask], [3, 99.5])
tone = np.clip((clahe - lo) / (hi - lo), 0, 1) ** 0.9
sharp = tone + 0.6 * (tone - ndimage.gaussian_filter(tone, 2.0))
tone = np.clip(sharp, 0, 1) * fm
hp = ndimage.gaussian_filter(luma, 1.2) - ndimage.gaussian_filter(luma, 5)
in_face = np.clip(1 - r2, 0, 1) > 0.05
hair = head_region & ~in_face & (yy < eye_mid[1] + 0.3 * E)
curls = np.clip(hp * 6, -1, 1) * 0.07 * E * ndimage.gaussian_filter(hair.astype(np.float32), 4)

head_depth = smax(head, front, 0.1 * E) + face * head_region + curls + 0.35 * E

# neck: per-row cylinder fitted to the silhouette, fading out as the shoulders widen
neck = np.zeros_like(body)
cx = int(eye_mid[0])
for y in range(H):
    if not body_region[y, cx]:
        continue
    row = mask[y]
    l = cx
    while l > 0 and row[l - 1]:
        l -= 1
    r = cx
    while r < W - 1 and row[r + 1]:
        r += 1
    hw = (r - l) / 2
    wgt = np.clip((2.8 * E - hw) / (1.4 * E), 0, 1)
    if wgt <= 0 or hw < 2:
        continue
    dx = np.clip((xx[y] - (l + r) / 2) / hw, -1, 1)
    neck[y] = 1.0 * E * np.sqrt(1 - dx**2) * (wgt * wgt * (3 - 2 * wgt))
neck = ndimage.gaussian_filter(neck, 7)
body = smax(body, neck, 0.12 * E) * body_region
depth = np.where(head_region, head_depth, body)
depth = ndimage.gaussian_filter(depth, 1.2) * mask
depth[~mask] = 0

# --- encode ------------------------------------------------------------------
# frame head and upper chest: the outer shoulders only cost size for the face
ys, xs = np.nonzero(mask)
y0, y1 = ys.min(), min(H, int(chin[1] + 2.0 * E))
x0, x1 = max(0, int(eye_mid[0] - 2.7 * E)), min(W, int(eye_mid[0] + 2.7 * E))
dmax = float(depth.max())
d16 = np.round(depth / dmax * 65535).astype(np.uint32)
img = np.zeros((H, W, 4), dtype=np.uint8)
img[..., 0] = np.round(tone * 255).astype(np.uint8)
img[..., 1] = (d16 >> 8).astype(np.uint8)
img[..., 2] = (d16 & 255).astype(np.uint8)
img[..., 3] = mask.astype(np.uint8) * 255
img = img[y0:y1, x0:x1]
out_dir.mkdir(parents=True, exist_ok=True)
Image.fromarray(img, "RGBA").save(out_dir / "bust.png", optimize=True)
meta = {
    "width": int(x1 - x0),
    "height": int(y1 - y0),
    "depthMax": dmax,
    "eye": E,
    "pivot": [float(eye_mid[0] - x0), float(eye_mid[1] - y0), float(head_depth[int(eye_mid[1]), int(eye_mid[0])] * 0.45)],
    "chinY": float(chin[1] - y0),
}
(out_dir / "bust.json").write_text(json.dumps(meta, indent=2))
print(meta)

# --- previews: frontal shading and a profile slice through the nose ---------
if preview_dir:
    gy, gx = np.gradient(depth)
    n = np.dstack([-gx, -gy, np.ones_like(depth)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    light = np.array([-0.45, -0.55, 0.7]); light /= np.linalg.norm(light)
    shade = np.clip(n @ light, 0, 1) * mask
    Image.fromarray((shade * 255).astype(np.uint8)).save(preview_dir / "bust_shade.png")
    Image.fromarray((tone * 255).astype(np.uint8)).save(preview_dir / "bust_tone.png")
    prof = np.zeros((H, int(dmax) + 20), dtype=np.uint8)
    col = int(eye_mid[0])
    for y in range(H):
        if mask[y, col]:
            prof[y, : int(depth[y, col])] = 255
    Image.fromarray(prof).save(preview_dir / "bust_profile.png")
