import './assets/main.css';
import 'virtual:uno.css';

import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StoreProvider } from './app/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StoreProvider>
        <App />
    </StoreProvider>,
);
