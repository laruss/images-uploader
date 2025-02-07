import { filetoDataURL } from 'image-conversion';
import Toastify from 'toastify-js';

let active = false;
let altIsPressed = false;

const colors = [
    'rgba(255, 0, 0, 0.3)',
    'rgba(0, 255, 0, 0.3)',
    'rgba(0, 0, 255, 0.3)',
    'rgba(255, 255, 0, 0.3)',
    'rgba(255, 0, 255, 0.3)',
    'rgba(0, 255, 255, 0.3)',
] as const;

const showToast = (text: string): void => {
    Toastify({
        text,
        duration: 2000,
        gravity: 'top',
        position: 'center',
        stopOnFocus: false,
        style: {
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            borderRadius: '5px',
        },
    }).showToast();
};

const overlays = new Map<HTMLImageElement, HTMLDivElement>();

const copyImageToClipboard = async (imageSource: string): Promise<void> => {
    // clipboard api doesn't work properly on MacOS, so we'll copy dataURL instead of blob
    const blob = await fetch(imageSource).then((res) => res.blob());
    const dataUrl = await filetoDataURL(blob);
    await navigator.clipboard.writeText(dataUrl);
};

const onMouseMove = (e: MouseEvent): void => {
    const elems = document.elementsFromPoint(e.clientX, e.clientY);
    const imgsUnderCursor: HTMLImageElement[] = elems.filter(
        (el) => el.tagName === 'IMG',
    ) as HTMLImageElement[];

    // Remove overlay for images that are no longer under the cursor.
    overlays.forEach((overlay, img) => {
        if (!imgsUnderCursor.includes(img)) {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            overlays.delete(img);
        }
    });

    imgsUnderCursor.forEach((img, index) => {
        let overlay: HTMLDivElement;
        if (!overlays.has(img)) {
            overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            // Устанавливаем pointerEvents по глобальному флагу altIsPressed
            overlay.style.pointerEvents = altIsPressed ? 'auto' : 'none';
            overlay.style.backgroundColor = colors[index % colors.length];
            overlay.style.border = '2px solid ' + colors[index % colors.length];
            overlay.style.color = 'white';
            overlay.style.fontSize = '16px';
            overlay.style.fontWeight = 'bold';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '100000000';
            overlay.innerText = `${img.naturalWidth}x${img.naturalHeight}`;
            document.body.appendChild(overlay);
            overlays.set(img, overlay);
        } else {
            overlay = overlays.get(img)!;
            overlay.innerText = `${img.naturalWidth}x${img.naturalHeight}`;
            overlay.style.pointerEvents = altIsPressed ? 'auto' : 'none';
        }

        const rect = img.getBoundingClientRect();
        overlay.style.left = rect.left + window.scrollX + 'px';
        overlay.style.top = rect.top + window.scrollY + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
    });
};

/**
 * Click handler.
 * @param e : MouseEvent - event object.
 */
function onClick(e: MouseEvent): void {
    if (e.altKey) {
        e.preventDefault();
        if (e.target instanceof HTMLImageElement) {
            copyImageToClipboard(e.target.src)
                .then(() => showToast('Image dataUrl copied to clipboard'))
                .catch((err) => showToast(`Failed to copy image to clipboard: ${err}`));
        } else {
            const elems = document.elementsFromPoint(e.clientX, e.clientY);
            const img: HTMLImageElement | undefined = elems.find(
                (el) => el.tagName === 'IMG',
            ) as HTMLImageElement;
            if (img) {
                copyImageToClipboard(img.src)
                    .then(() => showToast('Image copied to clipboard'))
                    .catch((err) => showToast(`Failed to copy image to clipboard: ${err}`));
            }
        }
    }
}

/**
 * Alt key down handler.
 * @param e : KeyboardEvent - event object.
 */
const onAltKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight') {
        if (!altIsPressed) {
            altIsPressed = true;
            overlays.forEach((overlay) => {
                overlay.style.pointerEvents = 'auto';
            });
        }
    }
};

/**
 * Alt key up handler.
 * @param e : KeyboardEvent - event object.
 */
const onAltKeyUp = (e: KeyboardEvent): void => {
    if (e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight') {
        if (altIsPressed) {
            altIsPressed = false;
            overlays.forEach((overlay) => {
                overlay.style.pointerEvents = 'none';
            });
        }
    }
};

/**
 * Switches the extension between active and inactive states.
 */
function toggleActive(): void {
    active = !active;
    altIsPressed = false;
    showToast(`Extension is ${active ? 'active' : 'inactive'}`);
    if (active) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('click', onClick, true);
        document.addEventListener('keydown', onAltKeyDown);
        document.addEventListener('keyup', onAltKeyUp);
        console.log('Backlight mode activated');
    } else {
        overlays.forEach((overlay) => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
        overlays.clear();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('keydown', onAltKeyDown);
        document.removeEventListener('keyup', onAltKeyUp);
        console.log('Backlight mode deactivated');
    }
}

const stylelink = document.createElement('link');
stylelink.rel = 'stylesheet';
stylelink.type = 'text/css';
stylelink.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
window.onload = (): void => {
    document.head.appendChild(stylelink);
};

// Handler for Ctrl+Shift+Y
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyX') {
        e.preventDefault();
        toggleActive();
    }
});
