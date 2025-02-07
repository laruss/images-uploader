import { clipboard, Notification } from 'electron';

import { processImage } from './imageProcessor';
import { computeImageHash } from './helpers/similiarity';
import { newImage } from './helpers/newImage';
import { tree } from './tree';
import { TypedStore } from '@main/store';
import { resetIdleTimer } from '@main/helpers/idleTimer';
import { readDataUrlImage } from '@main/helpers/clipboard';

/**
 * Launches a clipboard watcher that checks for new images.
 * If global.appIsActive === false, the watcher will not work.
 * If a new image is found, a notification will be displayed.
 *
 * @param store - store instance
 * @param intervalMs - interval in milliseconds
 * @returns interval identifier
 */
export function startClipboardWatcher(
    store: TypedStore,
    intervalMs: number = 1000,
): NodeJS.Timeout {
    return setInterval(async () => {
        if (!global.appIsActive) return;

        const { minSideSizePx, domain, apiToken, uploadPath } = store.get('settings');
        const minSideSize = minSideSizePx || 500;

        let clipImage = clipboard.readImage();
        if (clipImage.isEmpty()) {
            clipImage = readDataUrlImage();
            if (clipImage.isEmpty()) return;
        }

        const { width, height } = clipImage.getSize();
        if (width < minSideSize || height < minSideSize) return;

        const pngBuffer = clipImage.toPNG();

        const hash = await computeImageHash(pngBuffer);

        // todo: if image in the tree, check if it was uploaded
        if (tree.search(hash).length) return;
        const image = newImage({ buffer: pngBuffer, hash, tree });

        new Notification({
            title: 'New image found',
            body: `Dimensions: ${width}x${height}, hash: ${hash.slice(0, 8)}...`,
        }).show();

        resetIdleTimer();

        processImage({ image, domain, apiToken, uploadPath })
            .then((result) => {
                console.log(`Image ${result.imageId} processed: ${result.status}`);
            })
            .catch((err) => {
                console.error(`Error processing image ${hash}:`, err);
            });
    }, intervalMs);
}
