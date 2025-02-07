import { Tabs } from '@renderer/components/Tabs';
import { useStore } from '@renderer/app/store';
import { ReactElement, useEffect } from 'react';

export const App = (): ReactElement => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
