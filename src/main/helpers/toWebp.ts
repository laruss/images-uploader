import sharp from 'sharp';

type ConvertImageToWebpOptions = {
    imagePng: Buffer;
    maxSizeInMb: number;
    maxSizePerSide: number;
    maxQuality?: number;
};

/**
 * Converts an image from PNG to webp with respect to file size and maximum side constraints.
 *
 * @param imagePng : Buffer - Image in PNG format.
 * @param maxSizeInMb : number - Maximum allowed size of the resulting image in MB.
 * @param maxSizePerSide : number - Maximum allowed size of each side of the resulting image in pixels.
 * @param maxQuality : number - Maximum quality of the resulting image.
 * @returns Promise<Buffer> - Image in webp format.
 * @throws Error - If the image cannot be compressed to the specified size.
 */
export async function convertPngToWebp({
    imagePng,
    maxSizeInMb,
    maxSizePerSide,
    maxQuality = 90
}: ConvertImageToWebpOptions): Promise<Buffer> {
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;
    let quality = maxQuality;
    let outputBuffer: Buffer;

    const convertWithQuality = async (q: number): Promise<Buffer> => {
        return await sharp(imagePng)
            .resize({
                width: maxSizePerSide,
                height: maxSizePerSide,
                fit: 'inside'
            })
            .webp({ quality: q })
            .toBuffer();
    };

    outputBuffer = await convertWithQuality(quality);

    while (outputBuffer.length > maxSizeInBytes && quality > 10) {
        quality -= 10;
        outputBuffer = await convertWithQuality(quality);
    }

    if (outputBuffer.length > maxSizeInBytes) {
        throw new Error('Image cannot be compressed to the specified size.');
    }

    return outputBuffer;
}
