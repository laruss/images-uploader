import {
    app as electronApp,
    Menu,
    nativeImage,
    Tray,
    MenuItem,
    MenuItemConstructorOptions,
    Notification,
} from 'electron';
import { join } from 'path';

import { createWindow } from './window';
import { store } from '@main/store';
import { app } from '@main/app';

const idleIconPath = join(__dirname, '../../resources/tray/idleIcon.png');
const activeIconPath = join(__dirname, '../../resources/tray/activeIcon.png');

let tray: Tray | null = null;

const getTrayMenu = (): Array<MenuItem | MenuItemConstructorOptions> => [
    {
        label: global.appIsActive ? 'Deactivate' : 'Activate',
        click: (): void => {
            const { isSettingsValid } = store.get('state');
            if (!isSettingsValid) {
                new Notification({
                    title: 'Settings are not valid',
                    body: 'Please, check your settings',
                }).show();
                return;
            }

            global.appIsActive ? app.deactivate() : app.activate();
            console.log('App state toggled to:', global.appIsActive);
        },
    },
    {
        label: 'Open UI',
        click: (): void => {
            createWindow();
            // if app is in dock, bring it to front
            if (process.platform === 'darwin') {
                electronApp.dock.show();
            }
        },
    },
    { type: 'separator' },
    {
        label: 'Quit',
        click: (): void => {
            electronApp.quit();
        },
    },
];

export const updateTrayIcon = (): void => {
    const iconPath = global.appIsActive ? activeIconPath : idleIconPath;
    let trayImage = nativeImage.createFromPath(iconPath);

    if (process.platform === 'darwin') {
        // for macos we need to resize the image to 16x16
        trayImage = trayImage.resize({ width: 16, height: 16 });
        trayImage.setTemplateImage(true);
    }

    tray?.setImage(trayImage);
};

export const updateTrayMenu = (): void => {
    tray?.setContextMenu(Menu.buildFromTemplate(getTrayMenu()));
};

export const createTray = (): void => {
    const iconPath = global.appIsActive ? activeIconPath : idleIconPath;
    let trayImage = nativeImage.createFromPath(iconPath);
    if (process.platform === 'darwin') {
        trayImage = trayImage.resize({ width: 16, height: 16 });
        trayImage.setTemplateImage(true);
    }
    tray = new Tray(trayImage);

    // Tray menu
    const contextMenu = Menu.buildFromTemplate(getTrayMenu());
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
};
