import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { encodeAudioToImage } from './src/encoder.js';
import { decodeImageToAudio } from './src/decoder.js';

const [, , command, inputPath] = process.argv;

function ensureDirExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const OUTPUT_IMAGE_DIR = path.resolve('assets/output/images');
const OUTPUT_MUSIC_DIR = path.resolve('assets/output/music');

function showUsage() {
    console.log(`
${chalk.bold('Usage:')}
    ${chalk.cyan('e')} <input-audio>        → Encode audio to PNG
    ${chalk.cyan('d')} <input-image>        → Decode PNG to audio

${chalk.bold('Examples:')}
    ${chalk.gray('npm start -- e "./path/to/audio.mp3"')}
    ${chalk.gray('npm start -- d "./path/to/image.png"')}

${chalk.bold('Note:')} Outputs are saved in ${chalk.gray('assets/output/')} folder.
`);
}

function generateFileNameWithSuffix(baseDir, baseName, extension) {
    let filename = `${baseName}${extension}`;
    let fullPath = path.join(baseDir, filename);
    let counter = 1;

    while (fs.existsSync(fullPath)) {
        filename = `${baseName}(${counter})${extension}`;
        fullPath = path.join(baseDir, filename);
        counter++;
    }

    return fullPath;
}

if (!command || !inputPath) {
    console.error(chalk.red('❌ Missing required arguments.\n'));
    showUsage();
    process.exit(1);
}

const resolvedInput = path.resolve(inputPath);
const cmd = command.toLowerCase();

if (['encode', 'e'].includes(cmd)) {
    ensureDirExists(OUTPUT_IMAGE_DIR);

    const inputParsed = path.parse(resolvedInput);
    const baseName = inputParsed.name.replace(/\s+/g, '-');
    const outputFullPath = generateFileNameWithSuffix(OUTPUT_IMAGE_DIR, baseName, '.png');

    console.log(chalk.blueBright(`🚀 Encoding ${chalk.yellow(inputParsed.base)} → ${chalk.green(path.basename(outputFullPath))}`));
    encodeAudioToImage(resolvedInput, outputFullPath);

} else if (['decode', 'd'].includes(cmd)) {
    ensureDirExists(OUTPUT_MUSIC_DIR);

    const inputParsed = path.parse(resolvedInput);
    const baseName = inputParsed.name.replace(/\s+/g, '-');
    const outputFullPath = generateFileNameWithSuffix(OUTPUT_MUSIC_DIR, baseName, '.mp3');

    console.log(chalk.blueBright(`🎯 Decoding ${chalk.yellow(inputParsed.base)} → ${chalk.green(path.basename(outputFullPath))}`));
    decodeImageToAudio(resolvedInput, outputFullPath);

} else {
    console.error(chalk.red(`❌ Invalid command: "${command}"\n`));
    showUsage();
    process.exit(1);
}
