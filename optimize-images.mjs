import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const dir = path.join(process.cwd(), 'src', 'assets')

// targetWidth: max width to resize down to (2x the largest real display width), based on
// how each image is actually used in App.css (background canvases ~1920 wide, overlay
// images sized as a % of that canvas).
const targets = {
  'Frame1.png': 1920,       // full-bleed canvas background, already 1x
  'frame2.png': 1920,       // full-bleed canvas background, was 2x -> 1x
  'frame2_img1.png': 660,   // displayed ~17% of 1920 = 326px, 2x for retina
  'frame2_text1.png': 593,  // already close to display size
  'frame2_text2.png': 296,  // already close to display size
  'frame2_img2.png': 700,   // displayed ~18% of 1920 = 345px, 2x for retina
  'frame2_text3.png': 1600, // displayed up to 80% of 1920 = 1536px, ~1x/1.05x
  'frame4.png': 1920,       // full-bleed canvas background, was 2x -> 1x
  'frame4_img2.png': 1200,  // displayed 530-606px, 2x for retina
  'frame5.png': 1920,       // full-bleed background (1920x2160 design), was 2x -> 1x
  'frame5_text.png': 1200,  // displayed up to 600px, 2x for retina
  'frame6.png': 1920,       // full-bleed background, already 1x
  'frame6_text.png': 960,   // displayed up to 480px, 2x for retina
  'frame6_img.png': 1700,   // displayed ~85% of 1920 = 1632px, ~1x
  'frame7.png': 1920,       // full-bleed background, already 1x
  'frame7_text.png': 1964,  // displayed ~62% of 1920 = 1190px, keep near-original (small file already)
}

async function run() {
  let totalBefore = 0
  let totalAfter = 0

  for (const [file, targetWidth] of Object.entries(targets)) {
    const filePath = path.join(dir, file)
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${file}`)
      continue
    }
    const before = fs.statSync(filePath).size
    const img = sharp(filePath)
    const meta = await img.metadata()

    let pipeline = sharp(filePath)
    if (meta.width && meta.width > targetWidth) {
      pipeline = pipeline.resize({ width: targetWidth })
    }
    const buffer = await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 90 })
      .toBuffer()

    fs.writeFileSync(filePath, buffer)
    const after = buffer.length
    totalBefore += before
    totalAfter += after
    console.log(
      `${file.padEnd(20)} ${meta.width}x${meta.height} -> ` +
      `${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
    )
  }

  console.log('---')
  console.log(`TOTAL: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`)
}

run()
