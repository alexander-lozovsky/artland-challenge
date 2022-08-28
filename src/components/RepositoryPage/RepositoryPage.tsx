import { FC } from 'react';
import Searchbox from '../Searchbox';
import styles from './repositoryPage.module.css';
import RepositoryPageContent from '../RepositoryPageContent';

const RepositoryPage: FC = () => {
    return (
        <div className={styles.wrapper}>
            <Searchbox />
            <RepositoryPageContent />
        </div>
    );
};

export default RepositoryPage;
