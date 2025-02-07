import { FC, useEffect, useState } from 'react';
import { useStore } from '@renderer/app/store';
import { StoredImage } from '@preload/store';
import { Modal } from '@renderer/components/Modal';

type UploadedImagesProps = {
    images: StoredImage[];
};

export const UploadedImages: FC<UploadedImagesProps> = ({ images }) => {
    const [store, fetchStore] = useStore();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [imageData, setImageData] = useState('');

    useEffect(() => {
        setInterval(() => {
            fetchStore('uploadedImages');
        }, 1000);
    }, []);

    // Reverse the images array so that the latest image appears on top
    const sortedImages = [...images].reverse();

    const deleteImage = async (image: StoredImage): Promise<void> => {
        await window.api.setStoreValue(
            'uploadedImages',
            images.filter((i) => i.hash !== image.hash),
        );
        fetchStore('uploadedImages');
    };

    const deleteAllImages = async (): Promise<void> => {
        await window.api.setStoreValue('uploadedImages', []);
        fetchStore('uploadedImages');
    };

    // Function to "open" an image if its status is 'done'
    const openImage = (image: StoredImage): void => {
        const downloadPath = store?.settings.downloadPath;
        const domain = store?.settings.domain;

        if (!downloadPath) {
            alert('Please set the download path in the settings first.');
            return;
        }

        if (!domain) {
            alert('Please set the domain in the settings first.');
            return;
        }

        if (image.status === 'done' && image.uploadedPath) {
            const url = `${domain}${downloadPath}${image.uploadedPath}`;
            window.api
                .downloadImage(url)
                .then((base64) => {
                    if (!base64) return;

                    setImageData(base64);
                    setModalIsOpen(true);
                })
                .catch((err) => {
                    console.error('Error downloading image:', err);
                });
        } else {
            alert('openImage mutation: not allowed');
        }
    };

    if (sortedImages.length === 0) {
        return <div className="text-center">No images uploaded yet.</div>;
    }

    return (
        <>
            <div className="max-h-120 overflow-y-auto">
                <ul className="space-y-2">
                    {sortedImages.map((image) => (
                        <li
                            key={image.hash}
                            className="flex items-center justify-between p-2 border rounded"
                        >
                            {/* Image hash */}
                            <div className="flex-inline gap-2 items-center">
                                <span>Image:</span>
                                <span className="font-mono">{image.hash}</span>
                            </div>

                            {/* Status indicator */}
                            <div className="flex-inline gap-2 items-center">
                                <span>Status:</span>
                                <span>
                                    {image.status === 'done' && (
                                        <span className="text-green-500" title="Done">
                                            🟢
                                        </span>
                                    )}
                                    {image.status === 'error' && (
                                        <span className="text-red-500" title="Error">
                                            🔴
                                        </span>
                                    )}
                                    {image.status === 'notStarted' && (
                                        <span title="Not Started">⚪</span>
                                    )}
                                    {image.status === 'processing' && (
                                        // Simple spinner implemented using Uno CSS/Tailwind classes
                                        <span
                                            className="inline-block w-4 h-4 border-2 border-t-2 border-gray-300 rounded-full animate-spin"
                                            title="Processing"
                                        ></span>
                                    )}
                                </span>
                            </div>

                            <div className="flex-inline gap-2 items-center">
                                <span>Actions:</span>
                                {/* Open button */}
                                <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer"
                                    disabled={image.status !== 'done'}
                                    onClick={() => openImage(image)}
                                >
                                    Open ⧉
                                </button>
                                <button
                                    className="px-2 py-1 bg-[#f63b3bff] cursor-pointer"
                                    disabled={image.status === 'processing'}
                                    onClick={() => deleteImage(image)}
                                >
                                    Delete from list
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                className="mt-2 px-2 py-1 bg-[#f63b3bff] cursor-pointer"
                disabled={sortedImages.length === 0}
                onClick={deleteAllImages}
            >
                Delete all from list
            </button>
            <Modal
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
                imageData={imageData}
            />
        </>
    );
};
