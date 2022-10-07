import { FC, useState } from 'react';

import { useParams } from 'react-router-dom';
import CreateIssueModal from '../CreateIssueModal';
import { useGetRepositoryQuery } from '../../graphQL/generated-types';
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
        return <Loader className="h-80" />;
    }

    if (error) {
        return <p className="text-error text-center mt-40">Cannot retrieve repository</p>;
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
            <div className="mt-24 flex justify-between items-center">
                <h1 className="text-5xl">{name}</h1>
                <span className="text-xl">
                    {stargazerCount} Stars • {totalCount} Watching
                </span>
            </div>
            <div>
                <div className="flex justify-between mt-12 mb-3">
                    <h2 className="font-bold text-xl">Open issues</h2>
                    <button type="button" className="text-lg px-12 py-1 bg-success" onClick={onModalOpen}>
                        Create issue
                    </button>
                </div>

                {issues.nodes.length === 0 && <p>No issues have been opened</p>}
                {issues.nodes.length > 0 && (
                    <ul>
                        {issues.nodes.map(({ id, title, createdAt, number, author: { login } }) => {
                            const createdAtDate = new Date(createdAt);
                            const daysFromNow = differenceInDays(new Date(), createdAtDate);

                            return (
                                <li key={id} className="px-1 py-4 border-t last:border-b">
                                    <h3 className="mb-1 font-bold text-lg">{title}</h3>
                                    <span className="text-gray1 text-sm">
                                        #{number} opened{' '}
                                        <span title={createdAtDate.toString()}>{daysFromNow} days ago</span> by {login}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
                {isModalOpened && <CreateIssueModal onClose={onModalClose} repositoryId={id} />}
            </div>
        </div>
    );
};

export default RepositoryPageContent;
