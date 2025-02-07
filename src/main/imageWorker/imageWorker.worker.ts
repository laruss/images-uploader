import { Worker as NodeWorker } from 'worker_threads';
import { ImageMessage } from '@main/imageWorker/imageWorker.types';

export class TypedWorker extends NodeWorker {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage(message: ImageMessage, transferList?: any[]): void {
        super.postMessage(message, transferList);
    }
}
