import { useState, useEffect, FC, ChangeEvent } from 'react';
import { useStore } from '@renderer/app/store';
import { InputField } from '@renderer/components/InputField';
import { StoredSettings } from '@preload/store';

type SettingsProps = {
    settings: StoredSettings;
};

type FieldType = Readonly<{
    name: keyof StoredSettings;
    label: string;
    type: 'text' | 'number' | 'password';
}>;

const settingsFields = [
    {
        name: 'minSideSizePx',
        label: 'min side size (px)',
        type: 'number',
    },
    {
        name: 'domain',
        label: 'domain',
        type: 'text',
    },
    {
        name: 'apiToken',
        label: 'api token',
        type: 'password',
    },
    {
        name: 'uploadPath',
        label: 'upload path to use',
        type: 'text',
    },
    {
        name: 'downloadPath',
        label: 'download path to use',
        type: 'text',
    },
    {
        name: 'idleAfterSeconds',
        label: 'seconds after which the app is considered idle',
        type: 'number',
    },
    {
        name: 'showLastImages',
        label: 'number of last images to show',
        type: 'number',
    },
] as const satisfies ReadonlyArray<FieldType>;

export const Settings: FC<SettingsProps> = ({ settings }) => {
    // Local state for settings form
    const [localSettings, setLocalSettings] = useState<StoredSettings>(settings);
    const [isDirty, setIsDirty] = useState(false);
    const saveSettingsMutation = async (): Promise<void> =>
        await window.api.setStoreValue('settings', localSettings);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, fetchStore] = useStore();

    // Generic change handler for input fields
    const handleChange =
        (field: keyof StoredSettings) =>
        (e: ChangeEvent<HTMLInputElement>): void => {
            let value: string | number = e.target.value;
            // Convert value to number if the original type is number
            if (typeof settings[field] === 'number' && value) {
                value = Number(value);
            }
            setLocalSettings((prev) => ({ ...prev, [field]: value }));
            setIsDirty(true);
        };

    // Save button click handler that outputs the mutation name
    const saveSettings = (): void => {
        saveSettingsMutation().catch(console.error);
        fetchStore();
        setIsDirty(false);
    };

    // Update local state if external settings prop changes
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    return (
        <div className="space-y-4">
            {settingsFields.map(({ label, name, type }) => (
                <InputField
                    key={name}
                    label={label}
                    type={type}
                    value={localSettings[name]}
                    onChange={handleChange(name)}
                />
            ))}

            {/* Save button */}
            <button
                onClick={saveSettings}
                disabled={!isDirty}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
                Save
            </button>
        </div>
    );
};
