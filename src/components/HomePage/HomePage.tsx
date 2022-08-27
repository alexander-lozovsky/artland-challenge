import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Users from '../Users';
import Searchbox from '../Searchbox';
import styles from './homePage.module.css';

const HomePage: FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    return (
        <div className={styles.wrapper}>
            <Searchbox />
            {query && <Users query={query} />}
        </div>
    );
};

export default HomePage;
