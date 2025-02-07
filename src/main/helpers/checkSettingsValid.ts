import { TypedStore } from '@main/store';
import { Notification } from 'electron';
import { app } from '@main/app';

export const checkSettingsValid = (store: TypedStore): void => {
    const settings = store.get('settings');

    if (settings.domain && settings.apiToken && settings.uploadPath) {
        store.set('state', { isSettingsValid: true });
        new Notification({
            title: 'Settings are valid',
            body: 'You can start using the app',
        }).show();
    } else {
        store.set('state', { isSettingsValid: false });
        app.deactivate();

        new Notification({
            title: 'Settings are not valid',
            body: 'Please, check your settings (domain, API token and upload path)',
        }).show();
    }
};
