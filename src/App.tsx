import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import RepositoryPage from './components/RepositoryPage';
import NotFoundPage from './components/NotFoundPage';

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
