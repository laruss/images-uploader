import { parentPort } from 'worker_threads';
import { ImageMessage, UploadResult } from '@main/imageWorker/imageWorker.types';
import { convertPngToWebp } from '@main/helpers/toWebp';
import { uploadImage } from '@main/imageWorker/uploadImage';

if (!parentPort) {
    throw new Error('No parentPort available in worker');
}

parentPort.on('message', async (data: ImageMessage) => {
    const { imageId, imageBuffer, uploadPath, domain, apiToken } = data;
    const uploadUrl = `${domain}${uploadPath}`;
    console.log(`Worker: started processing image ${imageId}`);

    // here we can process the image
    const webpBuffer = await convertPngToWebp({
        imagePng: imageBuffer,
        maxSizeInMb: 0.8,
        maxSizePerSide: 1200,
    });
    const result = await uploadImage({ image: webpBuffer, url: uploadUrl, token: apiToken });
    console.log(`Worker: image ${imageId} uploaded: ${result.isSuccess ? 'success' : 'failed'}`);

    let postMessageMessage: UploadResult;

    if (result.isSuccess) {
        postMessageMessage = {
            imageId,
            status: 'success',
            imagePath: result.response.filename,
        };
    } else {
        postMessageMessage = {
            imageId,
            status: 'error',
            error: result.error,
        };
    }

    // sending result back to the parent
    parentPort?.postMessage(postMessageMessage);
});
