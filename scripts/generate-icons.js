import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawPixel) {
  // RGBA scanlines: 1 filter byte (0) + width * 4 bytes per row
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcPayload);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// CRC32 table implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Design for HVAC icon
function drawHvacIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const rNorm = dist / (w / 2);

  // Background deep dark slate #020617 with slight gradient
  const bgR = Math.round(15 - (y / h) * 13);
  const bgG = Math.round(23 - (y / h) * 17);
  const bgB = Math.round(42 - (y / h) * 19);

  // Dial ring (0.65 to 0.78 radius)
  if (rNorm >= 0.62 && rNorm <= 0.76) {
    const angle = Math.atan2(dy, dx); // -PI to +PI
    if (angle > -2.3 && angle < 2.3) {
      if (dx < 0) {
        // Cold blue low side
        return [56, 189, 248, 255]; // #38bdf8
      } else {
        // Hot red high side
        return [244, 63, 94, 255]; // #f43f5e
      }
    }
  }

  // Center hub
  if (dist <= w * 0.12) {
    if (dist <= w * 0.05) {
      return [56, 189, 248, 255];
    }
    return [30, 41, 59, 255];
  }

  // Needle pointing up-left
  const needleAngle = -1.2; // approx -68 degrees
  const angle = Math.atan2(dy, dx);
  const angleDiff = Math.abs(angle - needleAngle);
  if (angleDiff < 0.08 && dist <= w * 0.55 && dist >= w * 0.08) {
    return [56, 189, 248, 255];
  }

  // Corner rounding for square icon
  const cornerR = w * 0.18;
  const inLeft = x < cornerR;
  const inRight = x > w - cornerR;
  const inTop = y < cornerR;
  const inBottom = y > h - cornerR;

  if ((inLeft || inRight) && (inTop || inBottom)) {
    const cornerX = inLeft ? cornerR : w - cornerR;
    const cornerY = inTop ? cornerR : h - cornerR;
    const cornerDist = Math.sqrt((x - cornerX) ** 2 + (y - cornerY) ** 2);
    if (cornerDist > cornerR) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  return [bgR, bgG, bgB, 255];
}

// Generate all target PNG files
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, drawHvacIcon));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, drawHvacIcon));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, (x, y, w, h) => {
  // Maskable has safe zone padding
  return drawHvacIcon(x, y, w, h);
}));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, drawHvacIcon));

console.log('PWA icons successfully generated in ./public/');
