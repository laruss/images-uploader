import { useEffect, useCallback, FC } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageData: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, imageData }) => {
    const handleEscapeKey = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return (): void => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, handleEscapeKey]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full h-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
                    aria-label="Close modal"
                >
                    <IoMdClose size={24} />
                </button>
                <img
                    src={`data:image/png;base64,${imageData}`}
                    alt="Full screen image"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};
