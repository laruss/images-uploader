# uploader

An Electron application that uploads copied images to server.

## Features

Set up server URL, upload URL and Token and other in the settings.
Save settings and activate the app (in the tray bar).
Copy an image to the clipboard and the app will upload it to the server.
If any error occurs, the app will show a notification.

Then you can use the uploaded images in UI, you can click on it and see image from server.

## Chrome extension

You can use the Chrome extension (that is in the `extension` folder) to upload images from the browser.
When installed (as unpacked extension), you can activate script on any site by pressing `Ctrl + Shift + X` combination.
Then you will see images highlighted with a square. You can click on highlighted image with `Alt` (or `Option` on Mac) key pressed to copy it's dataUrl.
Combining with the Electron app, you can upload images from the browser to the server.
(Main app can parse image dataUrl and upload it to the server)

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ bun install
```

### Development

```bash
$ bun dev
```

### Build

```bash
# For macOS
$ bun run build:mac
```

## License

MIT
