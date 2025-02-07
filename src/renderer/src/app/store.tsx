import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { StoredSettings, StoreKey, StoreType } from '@preload/store';

export type FetchStoreType = (key?: StoreKey) => void;

export type StoreContextType = {
    store: StoreType | null;
    fetchStore: FetchStoreType;
};

const defaultStore: StoreType = {
    uploadedImages: [],
    settings: {} as StoredSettings,
    state: {
        isSettingsValid: false,
    },
};

const StoreContext = createContext<StoreContextType>({
    store: null,
    fetchStore: () => {},
});

const ipcGetStoreValue = async <K extends StoreKey>(key: K): Promise<StoreType[K]> =>
    await window.api.getStoreValue(key);

export const StoreProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [store, setStore] = useState<StoreType | null>(null);

    const fetchStore: FetchStoreType = (key) => {
        if (key) {
            ipcGetStoreValue(key).then((value) => {
                setStore((prevStore) =>
                    prevStore
                        ? { ...prevStore, [key]: value }
                        : {
                              ...defaultStore,
                              [key]: value,
                          },
                );
            });
            return;
        }

        ipcGetStoreValue('uploadedImages').then((uploadedImages) => {
            ipcGetStoreValue('settings').then((settings) => {
                ipcGetStoreValue('state').then((state) => {
                    setStore({
                        uploadedImages,
                        settings,
                        state,
                    });
                });
            });
        });
    };

    return <StoreContext.Provider value={{ store, fetchStore }}>{children}</StoreContext.Provider>;
};

export const useStore = (): [StoreType | null, FetchStoreType] => {
    const { store, fetchStore } = useContext(StoreContext);
    return [store, fetchStore];
};
