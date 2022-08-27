import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Searchbox from '../Searchbox';
import { useGetRepositoryQuery } from '../../@generated/graphql';

const RepositoryPage: FC = () => {
    const { userId, repositoryName } = useParams();
    const { data, loading, error } = useGetRepositoryQuery({
        variables: { name: repositoryName, owner: userId, first: 10 },
    });

    if (loading) {
        return <div>...loading</div>;
    }

    if (error) {
        return <div>Cannot retrieve repository</div>;
    }

    const {
        name,
        issues,
        stargazerCount,
        watchers: { totalCount },
    } = data.repository;
    return (
        <div>
            <Searchbox />
            <h1>{name}</h1>
            <span>
                {stargazerCount} stars • {totalCount} watching
            </span>
            <div>
                <h2>Open issues</h2>
                <button type="button">Create issue</button>
                <ul>
                    {issues.nodes.map((it) => {
                        return (
                            <li key={it.title}>
                                <h3>{it.title}</h3>
                                <span>
                                    # {it.number} opened by {it.author.login}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default RepositoryPage;
