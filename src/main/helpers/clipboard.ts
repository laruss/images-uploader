import { clipboard, NativeImage, nativeImage } from 'electron';

export const readDataUrlImage = (): NativeImage => {
    const clipboardText = clipboard.readText();
    if (!clipboardText.startsWith('data:image')) return nativeImage.createEmpty();

    return nativeImage.createFromDataURL(clipboardText);
};
