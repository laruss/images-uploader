import { app } from '@main/app';

global.appIsActive = false;
global.idleTimeout = null;

app.init();
