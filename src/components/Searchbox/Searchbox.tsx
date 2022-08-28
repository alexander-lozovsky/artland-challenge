import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './searchbox.module.css';

const Searchbox = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/?query=${searchQuery}`);
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    return (
        <div>
            <form onSubmit={onSubmit} className={styles.form}>
                <input
                    type="search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={onChange}
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
