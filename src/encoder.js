import fs from 'fs';
import { PNG } from 'pngjs';

export function encodeAudioToImage(audioPath, outputImagePath) {
    return new Promise((resolve, reject) => {
        try {
            const buffer = fs.readFileSync(audioPath);
            const length = buffer.length;
            const side = Math.ceil(Math.sqrt(length / 3));
            const totalPixels = side * side;
            const padded = Buffer.alloc(totalPixels * 3);
            buffer.copy(padded);

            const png = new PNG({ width: side, height: side });

            for (let i = 0; i < totalPixels; i++) {
                const idx = i * 4;
                png.data[idx] = padded[i * 3];
                png.data[idx + 1] = padded[i * 3 + 1];
                png.data[idx + 2] = padded[i * 3 + 2];
                png.data[idx + 3] = 255;
            }

            const writeStream = fs.createWriteStream(outputImagePath);
            writeStream.on('finish', () => {
                console.log(`✅ Encoded audio to image: ${outputImagePath}`);
                resolve();
            });
            writeStream.on('error', err => {
                console.error(`❌ Encoding failed: ${err.message}`);
                reject(err);
            });

            png.pack().pipe(writeStream);
        } catch (err) {
            console.error(`❌ Encoding failed: ${err.message}`);
            reject(err);
        }
    });
}
