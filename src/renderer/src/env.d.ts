/// <reference types="vite/client" />

import { electronAPI } from '@electron-toolkit/preload';
import { api } from 'src/preload/api';

declare global {
    interface Window {
        electron: typeof electronAPI;
        api: typeof api;
    }
}
