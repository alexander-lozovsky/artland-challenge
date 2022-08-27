import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Searchbox = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                navigate(`/?query=${searchQuery}`);
            }}
        >
            <input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default Searchbox;
