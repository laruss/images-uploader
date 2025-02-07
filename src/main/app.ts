import { app as electronApp, BrowserWindow, ipcMain, Notification } from 'electron';
import { tree } from '@main/tree';
import { store } from '@main/store';
import { checkSettingsValid } from '@main/helpers/checkSettingsValid';
import { checkDeleteImageFromList, checkImagesListIsEmpty } from '@main/helpers/imagesList';
import { downloadImage } from '@main/helpers/downloadImage';
import { createTray, updateTrayIcon, updateTrayMenu } from '@main/tray';
import { startClipboardWatcher } from '@main/clipboardWatcher';
import { optimizer } from '@electron-toolkit/utils';
import { createWindow } from '@main/window';
import { resetIdleTimer } from '@main/helpers/idleTimer';
import { StoreKey, StoreType } from '@preload/store';

export const app = {
    init(): void {
        electronApp.whenReady().then(() => {
            electronApp.setAppUserModelId('com.electron');

            tree.insertMany(store.get('uploadedImages').map((image) => image.hash));

            ipcMain.handle('store-get', async (_, key: StoreKey) => {
                if (key === 'uploadedImages') {
                    const qtyToShow = store.get('settings').showLastImages;
                    const images = store.get('uploadedImages');
                    return images.filter((_, i) => i < (qtyToShow || 200));
                }
                return store.get(key);
            });

            ipcMain.handle(
                'store-set',
                async <K extends StoreKey>(_, key: K, value: StoreType[K]) => {
                    if (key === 'uploadedImages') {
                        checkDeleteImageFromList(store, value as StoreType['uploadedImages']);
                    }
                    store.set(key, value);
                    checkSettingsValid(store);
                    checkImagesListIsEmpty(store);
                },
            );

            ipcMain.handle('download-image', async (_, url: string) => {
                const token = store.get('settings').apiToken;
                const result = await downloadImage({ url, token });
                if (!result.isSuccess) {
                    new Notification({
                        title: 'Error downloading image',
                        body: result.error,
                    }).show();
                    return null;
                }

                return result.image.toString('base64');
            });

            createTray();

            startClipboardWatcher(store);

            if (process.platform === 'darwin') {
                electronApp.dock.hide();
            }

            electronApp.on('browser-window-created', (_, window) => {
                optimizer.watchWindowShortcuts(window);
            });

            ipcMain.on('ping', () => console.log('pong'));

            electronApp.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow();
                }
            });
        });

        electronApp.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                electronApp.quit();
            } else {
                electronApp.dock.hide();
            }
        });
    },
    activate(): void {
        global.appIsActive = true;
        updateTrayIcon();
        updateTrayMenu();
        resetIdleTimer();
    },
    deactivate(): void {
        global.appIsActive = false;
        updateTrayIcon();
        updateTrayMenu();
    },
};
