import Store from 'electron-store';
import { StoreType } from '@preload/store';

// this is work-around because typescript doesn't see the methods we added to the Store class
export class TypedStore extends Store<StoreType> {
    get<K extends keyof StoreType>(key: K): StoreType[K] {
        // @ts-expect-error: get is not defined in electron-store
        return super.get(key);
    }
    set<K extends keyof StoreType>(key: K, value: StoreType[K]): void {
        // @ts-expect-error: set is not defined in electron-store
        super.set(key, value);
    }
    delete<K extends keyof StoreType>(key: K): void {
        // @ts-expect-error: delete is not defined in electron-store
        super.delete(key);
    }
}

const defaults: StoreType = {
    uploadedImages: [],
    settings: {
        minSideSizePx: 500,
        domain: '',
        apiToken: '',
        uploadPath: '',
        downloadPath: '',
        idleAfterSeconds: 600,
        showLastImages: 200,
    },
    state: {
        isSettingsValid: false,
    },
};

export const store = new TypedStore({ defaults });
