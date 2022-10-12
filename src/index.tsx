import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import graphqlClient from './graphQL/client';

import Root from './routes/root';
import Search, { loader as searchLoader } from './routes/search';
import Repository, { loader as repositoryLoader } from './routes/repository';
import NewIssue, { action as newIssueAction } from './routes/newIssue';

import NotFoundPage from './components/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            { path: 'search', element: <Search />, loader: searchLoader },
            {
                path: '/users/:userId/repositories/:repositoryName',
                element: <Repository />,
                loader: repositoryLoader,
                children: [{ path: 'new-issue', element: <NewIssue />, action: newIssueAction }],
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ApolloProvider client={graphqlClient}>
                <RouterProvider router={router} />
            </ApolloProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
