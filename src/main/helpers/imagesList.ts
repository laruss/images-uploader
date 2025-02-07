import { TypedStore } from '@main/store';
import { tree } from '../tree';
import { StoredImage } from '@preload/store';

export const checkImagesListIsEmpty = (store: TypedStore): void => {
    const images = store.get('uploadedImages');

    if (images.length === 0) {
        tree.deleteAll();
    }
};

export const checkDeleteImageFromList = (store: TypedStore, newImages: StoredImage[]): void => {
    const images = store.get('uploadedImages');
    if (images.length > newImages.length && newImages.length > 0) {
        // get image that was deleted and delete it from the tree
        const deletedImage = images.filter(
            (image) => !newImages.some((newImage) => newImage.hash === image.hash),
        );
        tree.delete(deletedImage[0].hash);
    }
};
