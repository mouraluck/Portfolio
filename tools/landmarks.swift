import Foundation
import Vision
import ImageIO

let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("read") }
let W = Double(cg.width), H = Double(cg.height)

let req = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(cgImage: cg).perform([req])
guard let face = req.results?.first, let lm = face.landmarks else { fatalError("no face") }

func pts(_ r: VNFaceLandmarkRegion2D?) -> [[Double]] {
  guard let r else { return [] }
  // pointsInImage uses a bottom-left origin; flip to top-left pixel coords
  return r.pointsInImage(imageSize: CGSize(width: W, height: H)).map { [Double($0.x), H - Double($0.y)] }
}

let out: [String: Any] = [
  "size": [W, H],
  "bbox": [face.boundingBox.minX * W, (1 - face.boundingBox.maxY) * H, face.boundingBox.width * W, face.boundingBox.height * H],
  "yaw": face.yaw?.doubleValue ?? 0, "roll": face.roll?.doubleValue ?? 0, "pitch": face.pitch?.doubleValue ?? 0,
  "faceContour": pts(lm.faceContour), "leftEye": pts(lm.leftEye), "rightEye": pts(lm.rightEye),
  "leftEyebrow": pts(lm.leftEyebrow), "rightEyebrow": pts(lm.rightEyebrow), "nose": pts(lm.nose),
  "noseCrest": pts(lm.noseCrest), "medianLine": pts(lm.medianLine), "outerLips": pts(lm.outerLips),
  "innerLips": pts(lm.innerLips), "leftPupil": pts(lm.leftPupil), "rightPupil": pts(lm.rightPupil),
]
let data = try JSONSerialization.data(withJSONObject: out, options: [.prettyPrinted])
try data.write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
print("ok")
