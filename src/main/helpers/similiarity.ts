import sharp from 'sharp';

/**
 * Computes the perceptual hash of an image using the dHash algorithm.
 * The image is normalized to a 256x256 square (preserving the aspect ratio using padding),
 * then resized to 9x8, converted to grayscale, and processed to generate a 64-bit hash.
 *
 * @param imageBuffer : Buffer - The input image as a Buffer.
 * @returns Promise<string> - A Promise that resolves to the hexadecimal representation of the hash.
 */
export async function computeImageHash(imageBuffer: Buffer): Promise<string> {
    // Normalize the image to a 256x256 square while preserving the aspect ratio (using padding).
    const normalizedBuffer = await sharp(imageBuffer)
        .resize({ width: 256, height: 256, fit: 'contain', background: { r: 255, g: 255, b: 255 } })
        .toBuffer();

    // Resize the normalized image to 9x8, convert to grayscale, and extract raw pixel data.
    const { data } = await sharp(normalizedBuffer)
        .resize(9, 8) // dHash requires 9 columns and 8 rows to perform 8 comparisons per row.
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Compute the binary hash string by comparing adjacent pixels.
    let hashBinary = '';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const idx = y * 9 + x;
            const leftPixel = data[idx];
            const rightPixel = data[idx + 1];
            // Append "1" if the left pixel is greater than the right; otherwise, append "0".
            hashBinary += leftPixel > rightPixel ? '1' : '0';
        }
    }

    // Convert the 64-bit binary string into its hexadecimal representation.
    return binaryStringToHex(hashBinary);
}

/**
 * Converts a binary string (e.g., "1010...") into a hexadecimal string.
 *
 * @param binaryStr : string - A 64-character binary string.
 * @returns string - The hexadecimal representation of the binary string.
 */
function binaryStringToHex(binaryStr: string): string {
    let hex = '';
    // Process every 4 bits into one hexadecimal digit.
    for (let i = 0; i < binaryStr.length; i += 4) {
        const chunk = binaryStr.substr(i, 4);
        const hexDigit = parseInt(chunk, 2).toString(16);
        hex += hexDigit;
    }
    return hex;
}

/**
 * Calculates the Hamming distance between two hexadecimal hashes.
 * The Hamming distance is the number of differing bits between the two hashes.
 *
 * @param hash1 : string - The first hexadecimal hash.
 * @param hash2 : string - The second hexadecimal hash.
 * @returns number - The number of differing bits.
 */
function hammingDistance(hash1: string, hash2: string): number {
    if (hash1.length !== hash2.length) {
        throw new Error('Hashes must be of equal length');
    }
    let distance = 0;
    // Compare each hexadecimal digit by converting them to numbers and counting differing bits.
    for (let i = 0; i < hash1.length; i++) {
        const n1 = parseInt(hash1[i], 16);
        const n2 = parseInt(hash2[i], 16);
        let xor = n1 ^ n2;
        while (xor) {
            distance += xor & 1;
            xor = xor >> 1;
        }
    }
    return distance;
}

/**
 * Determines whether two image hashes are similar based on the provided similarity percentage threshold.
 * The similarity percentage is calculated as: ((totalBits - hammingDistance) / totalBits) * 100.
 *
 * @param hash1 : string - The first hexadecimal hash string.
 * @param hash2 : string - The second hexadecimal hash string.
 * @param similarityThreshold : number - The minimum similarity percentage required (0 to 100).
 * @returns boolean - True if the similarity percentage is greater than or equal to the threshold, otherwise false.
 */
export function areHashesSimilar(
    hash1: string,
    hash2: string,
    similarityThreshold: number,
): boolean {
    const totalBits = 64; // dHash produces a 64-bit hash.
    const distance = hammingDistance(hash1, hash2);
    const similarityPercentage = ((totalBits - distance) / totalBits) * 100;
    return similarityPercentage >= similarityThreshold;
}
