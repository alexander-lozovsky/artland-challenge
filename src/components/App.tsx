import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RepositoryPage from './RepositoryPage';
import NotFoundPage from './NotFoundPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users/:userId/repositories/:repositoryName" element={<RepositoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
