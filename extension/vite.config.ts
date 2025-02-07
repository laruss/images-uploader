import { defineConfig } from 'vite';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateManifest(): Record<any, any> {
    const manifest = readJsonFile('src/manifest.json');
    const pkg = readJsonFile('package.json');
    return {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        ...manifest,
    };
}

export default defineConfig({
    plugins: [
        webExtension({
            manifest: generateManifest,
            watchFilePaths: ['package.json', 'manifest.json'],
        }),
    ],
});
