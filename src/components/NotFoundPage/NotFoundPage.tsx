import { FC } from 'react';
import styles from './notFoundPage.module.css';

const NotFoundPage: FC = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.message}>Page not found</p>
        </div>
    );
};

export default NotFoundPage;
