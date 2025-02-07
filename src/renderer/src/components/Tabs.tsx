import { useState } from 'react';
import { UploadedImages } from './UploadedImages';
import { Settings } from './Settings';
import { useStore } from '@renderer/app/store';

export const Tabs = () => {
    // State to track the active tab
    const [activeTab, setActiveTab] = useState<'uploadedImages' | 'settings'>('uploadedImages');
    const [store] = useStore();

    if (!store) return null;

    return (
        <div className="p-4">
            {/* Tab headers */}
            <div className="flex border-b border-gray-300">
                <button
                    className={`p-2 ${activeTab === 'uploadedImages' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('uploadedImages')}
                >
                    Uploaded Images
                </button>
                <button
                    className={`p-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            {/* Tab content */}
            <div className="mt-4">
                {activeTab === 'uploadedImages' ? (
                    <UploadedImages images={store.uploadedImages} />
                ) : (
                    <Settings settings={store.settings} />
                )}
            </div>
        </div>
    );
};
