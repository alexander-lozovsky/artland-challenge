import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/App';

const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    headers: {
        authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
    },
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>
);
