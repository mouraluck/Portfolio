import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let src = CGImageSourceCreateWithURL(input as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("cannot read image") }

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg)
try handler.perform([req])
guard let result = req.results?.first else { fatalError("no subject found") }
let buf = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)

let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
guard let out = ctx.createCGImage(ci, from: ci.extent) else { fatalError("render failed") }
let dest = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil)
CGImageDestinationFinalize(dest)
print("ok \(out.width)x\(out.height)")
