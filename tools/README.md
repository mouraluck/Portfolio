# Bust pipeline

Builds `src/assets/bust.png` + `bust.json` (the sculpted depth map the hero renders) from one frontal photo.

```bash
swiftc -O tools/cutout.swift -o /tmp/cutout && /tmp/cutout tools/input/photo.jpg tools/input/cutout.png
swiftc -O tools/landmarks.swift -o /tmp/landmarks && /tmp/landmarks tools/input/photo.jpg tools/input/landmarks.json
uv run --with numpy --with scipy --with pillow --with scikit-image tools/sculpt_bust.py tools/input/photo.jpg tools/input/cutout.png tools/input/landmarks.json src/assets
```

`cutout.swift` removes the background and `landmarks.swift` finds the face points, both with Apple Vision. `sculpt_bust.py` inflates the silhouette into a volume and sculpts brow, eyes, nose, lips, chin, neck and hair curls on it from those points.
