import { Notification } from 'electron';
import { store } from '@main/store';
import { app } from '@main/app';

function showIdleNotification(): void {
    const notification = new Notification({
        title: 'Idle Notification',
        body: 'The application is now idle.',
    });
    notification.show();
}

export function resetIdleTimer(): void {
    const idleSeconds = store.get('settings').idleAfterSeconds;
    const IDLE_TIME = idleSeconds * 1000;

    // Clear any existing timer
    if (global.idleTimeout) {
        clearTimeout(global.idleTimeout);
    }

    // Start a new timer that will mark the app as idle after IDLE_TIME.
    global.idleTimeout = setTimeout(() => {
        app.deactivate();
        showIdleNotification();

        // Send status update to renderer
        // if (mainWindow) {
        //     mainWindow.webContents.send('update-status', 'idle');
        // }
    }, IDLE_TIME);
}
