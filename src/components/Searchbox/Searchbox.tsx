import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './searchbox.module.css';

const Searchbox = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    navigate(`/?query=${searchQuery}`);
                }}
                className={styles.form}
            >
                <input
                    type="search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.searchBtn}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default Searchbox;
