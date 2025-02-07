import { Tabs } from '@renderer/components/Tabs';
import { useStore } from '@renderer/app/store';
import { useEffect } from 'react';

export const App = () => {
    const [_, fetchStore] = useStore();

    useEffect(() => {
        fetchStore();
    }, []);

    return (
        <>
            <Tabs />
        </>
    );
};
