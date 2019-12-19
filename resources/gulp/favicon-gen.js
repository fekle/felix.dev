const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const SIZES = [16, 32, 64, 128, 152, 167, 180, 192, 196, 256, 512, 1024];

const resize = async (inputFile, outputDir, size) => {
  const outputFileName = path.join(outputDir, `favicon-${size}.png`);

  const buf = await sharp(fs.readFileSync(inputFile))
    .resize(size * 2, size * 2)
    .resize(size, size)
    .png()
    .toBuffer();

  await imagemin.buffer(buf, {
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.95],
      }),
    ],
  });

  return fs.writeFileSync(outputFileName, buf);
};

const run = async (sourceFile, outputDir) => {
  const promises = [];

  fs.removeSync(outputDir);
  fs.mkdirSync(outputDir);

  for (const size of SIZES) {
    promises.push(resize(sourceFile, outputDir, size));
  }

  await Promise.all(promises);
};

module.exports = run;
