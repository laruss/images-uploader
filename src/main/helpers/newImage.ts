import { BKTree } from './bkTree';
import { store } from '@main/store';
import { ProcessingStatus, StoredImage } from '@preload/store';

type NewImageProps = {
    buffer: Buffer;
    hash: string;
    tree: BKTree;
};

export const newImage = ({ hash, buffer, tree }: NewImageProps) => {
    tree.insert(hash);
    const images = store.get('uploadedImages');
    const insertImage = (image: StoredImage): void =>
        store.set('uploadedImages', [...images, image]);
    insertImage({ hash, status: 'notStarted' });

    return {
        buffer,
        hash,
        get _images(): StoredImage[] {
            return store.get('uploadedImages');
        },
        _updateImage(image: StoredImage): void {
            store.set(
                'uploadedImages',
                this._images.map((i) => (i.hash === hash ? image : i)),
            );
        },
        setStatus(status: ProcessingStatus): void {
            this._updateImage({ hash, status });
        },
        setUploadedPath(uploadedPath: string): void {
            this._updateImage({ hash, status: 'done', uploadedPath });
        },
        get data(): StoredImage | undefined {
            return this._images.find((i) => i.hash === hash);
        },
    };
};

export type Image = ReturnType<typeof newImage>;
