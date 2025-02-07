export type ProcessingStatus = 'notStarted' | 'processing' | 'done' | 'error';

export type StoredImage = {
    hash: string;
    status: ProcessingStatus;
    uploadedPath?: string;
};

export type StoredSettings = {
    minSideSizePx: number;
    domain: string;
    apiToken: string;
    uploadPath: string;
    downloadPath: string;
    idleAfterSeconds: number;
    showLastImages: number;
};

export type StoredState = {
    isSettingsValid: boolean;
};

export type StoreType = {
    uploadedImages: StoredImage[];
    settings: StoredSettings;
    state: StoredState;
};

export type StoreKey = keyof StoreType;
