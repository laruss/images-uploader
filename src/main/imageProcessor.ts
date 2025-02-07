import { join } from 'path';
import { TypedWorker } from '@main/imageWorker/imageWorker.worker';
import { UploadResult } from '@main/imageWorker/imageWorker.types';
import { Notification } from 'electron';
import { Image } from './helpers/newImage';

type ProcessImageParams = {
    image: Image;
    domain: string;
    apiToken: string;
    uploadPath: string;
};

export function processImage({ image, ...props }: ProcessImageParams): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        // path to compiled worker file
        const worker = new TypedWorker(join(__dirname, 'worker.js'));

        worker.on('message', (message: UploadResult) => {
            const { status, imageId } = message;
            if (status === 'error') {
                image.setStatus('error');
                new Notification({
                    title: 'Image upload failed',
                    body: `Image ${imageId} failed to upload: ${(message as UploadResult<'error'>).error}`,
                }).show();
            } else {
                image.setUploadedPath((message as UploadResult<'success'>).imagePath);
                new Notification({
                    title: 'Image uploaded',
                    body: `Image ${imageId} uploaded successfully`,
                }).show();
            }
            resolve(message);
        });

        worker.on('error', (err) => {
            console.error('Worker error:', err);
            reject(err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });

        image.setStatus('processing');
        // sending image data to the worker
        worker.postMessage({ imageId: image.hash, imageBuffer: image.buffer, ...props });
    });
}
