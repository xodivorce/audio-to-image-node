import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

export function decodeImageToAudio(imagePath) {
    try {
        const parsedPath = path.parse(imagePath);
        const outputDir = path.resolve('assets/output/music');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputFileName = parsedPath.name.replace(/\s+/g, '-') + '.mp3';
        const outputAudioPath = path.join(outputDir, outputFileName);

        fs.createReadStream(imagePath)
            .pipe(new PNG())
            .on('parsed', function () {
                const binaryData = [];
                for (let i = 0; i < this.data.length; i += 4) {
                    binaryData.push(this.data[i]);
                    binaryData.push(this.data[i + 1]);
                    binaryData.push(this.data[i + 2]);
                }
                const buffer = Buffer.from(binaryData);
                fs.writeFileSync(outputAudioPath, buffer);
                console.log(`✅ Decoded audio from image: ${outputAudioPath}`);
            });
    } catch (err) {
        console.error(`❌ Decoding failed: ${err.message}`);
    }
}
