import { FC, useState } from 'react';

import { useParams } from 'react-router-dom';
import CreateIssueModal from '../CreateIssueModal';
import { useGetRepositoryQuery, useCreateIssueMutation, GetRepositoryDocument } from '../../graphQL/generated-types';
import styles from './repositoryPageContent.module.css';
import Loader from '../Loader';
import { ICreateIssuePayload } from '../../types';
import { differenceInDays } from '../../utils';

const RepositoryPageContent: FC = () => {
    const { userId, repositoryName } = useParams();
    const [isModalOpened, setIsModalOpened] = useState(false);
    // TODO add pagination
    const { data, loading, error } = useGetRepositoryQuery({
        variables: { name: repositoryName, owner: userId, first: 10 },
    });

    const [createIssue, createIssueResults] = useCreateIssueMutation({ refetchQueries: [GetRepositoryDocument] });

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

    const onCreateIssue = async ({ title, description }: ICreateIssuePayload) => {
        await createIssue({ variables: { input: { repositoryId: id, title, body: description } } });
        // TODO show some message on success/failure
        onModalClose();
    };

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
                    {issues.nodes.map(({ title, createdAt, number, author: { login } }) => {
                        const createdAtDate = new Date(createdAt);
                        const daysFromNow = differenceInDays(new Date(), createdAtDate);

                        return (
                            <li key={title} className={styles.issue}>
                                <h3 className={styles.issueTitle}>{title}</h3>
                                <span className={styles.openedBy}>
                                    #{number} opened{' '}
                                    <span title={createdAtDate.toString()}>{daysFromNow} days ago</span> by {login}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                {isModalOpened && (
                    <CreateIssueModal
                        onClose={onModalClose}
                        onCreate={onCreateIssue}
                        isSubmitting={createIssueResults.loading}
                    />
                )}
            </div>
        </div>
    );
};

export default RepositoryPageContent;
