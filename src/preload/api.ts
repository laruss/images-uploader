import { ipcRenderer } from 'electron';
import { StoreKey, StoreType } from '@preload/store';

export const api = {
    getStoreValue: async <K extends StoreKey>(key: K): Promise<StoreType[K]> =>
        await ipcRenderer.invoke('store-get', key),
    setStoreValue: async <K extends StoreKey>(key: K, value: StoreType[K]): Promise<void> =>
        ipcRenderer.invoke('store-set', key, value),
    downloadImage: async (url: string): Promise<string | null> =>
        ipcRenderer.invoke('download-image', url),
};
