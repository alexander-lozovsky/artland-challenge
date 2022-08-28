import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RepositoryPage from './RepositoryPage';
import NotFoundPage from './NotFoundPage';
import ErrorBoundary from './ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/users/:userId/repositories/:repositoryName" element={<RepositoryPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
}

export default App;
