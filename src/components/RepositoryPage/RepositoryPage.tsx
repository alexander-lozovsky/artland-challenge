import { FC, useState } from 'react';

import { useParams } from 'react-router-dom';
import Searchbox from '../Searchbox';
import CreateIssueModal from '../CreateIssueModal';
import { useGetRepositoryQuery, useCreateIssueMutation, GetRepositoryDocument } from '../../@generated/graphql';
import styles from './repositoryPage.module.css';

const RepositoryPage: FC = () => {
    const { userId, repositoryName } = useParams();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const { data, loading, error } = useGetRepositoryQuery({
        variables: { name: repositoryName, owner: userId, first: 10 },
    });

    const [createIssue] = useCreateIssueMutation({ refetchQueries: [GetRepositoryDocument] });

    if (loading) {
        return <div>...loading</div>;
    }

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

    const onCreateIssue = async ({ title, description }: any) => {
        await createIssue({ variables: { input: { repositoryId: id, title, body: description } } });
        onModalClose();
    };

    return (
        <div className={styles.wrapper}>
            <Searchbox />
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
                    {issues.nodes.map((it) => {
                        const createdAt = new Date(it.createdAt).getTime();
                        const now = Date.now();

                        const diffDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));

                        return (
                            <li key={it.title} className={styles.issue}>
                                <h3 className={styles.issueTitle}>{it.title}</h3>
                                <span className={styles.openedBy}>
                                    #{it.number} opened {diffDays} days ago by {it.author.login}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                {isModalOpened && <CreateIssueModal onClose={onModalClose} onCreate={onCreateIssue} />}
            </div>
        </div>
    );
};

export default RepositoryPage;
