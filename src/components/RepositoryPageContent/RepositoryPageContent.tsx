import { FC, useState } from 'react';

import { useParams } from 'react-router-dom';
import CreateIssueModal from '../CreateIssueModal';
import { useGetRepositoryQuery } from '../../graphQL/generated-types';
import styles from './repositoryPageContent.module.css';
import Loader from '../Loader';
import { differenceInDays } from '../../utils';

const RepositoryPageContent: FC = () => {
    const { userId, repositoryName } = useParams();
    const [isModalOpened, setIsModalOpened] = useState(false);
    // TODO add pagination
    const { data, loading, error } = useGetRepositoryQuery({
        variables: { name: repositoryName, owner: userId, first: 10 },
    });

    if (loading) {
        return <Loader className={styles.loader} />;
    }

    // TODO add styling
    if (error) {
        return <div>Cannot retrieve repository</div>;
    }

    const {
        id,
        name,
        issues,
        stargazerCount,
        watchers: { totalCount },
    } = data.repository;

    const onModalOpen = () => setIsModalOpened(true);
    const onModalClose = () => setIsModalOpened(false);

    return (
        <div>
            {loading && <Loader />}
            {error && <p>Cannot retrieve repository</p>}
            <div className={styles.nameWrapper}>
                <h1 className={styles.name}>{name}</h1>
                <span className={styles.stats}>
                    {stargazerCount} Stars • {totalCount} Watching
                </span>
            </div>
            <div className={styles.issuesWrapper}>
                <div className={styles.issuesTitleWrapper}>
                    <h2 className={styles.issuesTitle}>Open issues</h2>
                    <button type="button" className={styles.createIssueBtn} onClick={onModalOpen}>
                        Create issue
                    </button>
                </div>

                <ul className={styles.issuesList}>
                    {issues.nodes.map(({ id, title, createdAt, number, author: { login } }) => {
                        const createdAtDate = new Date(createdAt);
                        const daysFromNow = differenceInDays(new Date(), createdAtDate);

                        return (
                            <li key={id} className={styles.issue}>
                                <h3 className={styles.issueTitle}>{title}</h3>
                                <span className={styles.openedBy}>
                                    #{number} opened{' '}
                                    <span title={createdAtDate.toString()}>{daysFromNow} days ago</span> by {login}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                {isModalOpened && <CreateIssueModal onClose={onModalClose} repositoryId={id} />}
            </div>
        </div>
    );
};

export default RepositoryPageContent;
