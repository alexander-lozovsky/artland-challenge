import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Searchbox from './Searchbox';

const GET_REPOSITORY = gql`
    query GetRepository($name: String!, $owner: String!, $length: Int!, $issueCursor: String) {
        repository(name: $name, owner: $owner) {
            name
            stargazerCount
            watchers {
                totalCount
            }
            issues(
                first: $length
                after: $issueCursor
                filterBy: { states: OPEN }
                orderBy: { field: CREATED_AT, direction: DESC }
            ) {
                nodes {
                    title
                    number
                    createdAt
                    author {
                        login
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
                totalCount
            }
        }
    }
`;

const RepositoryPage: FC = () => {
    const { userId, repositoryName } = useParams();
    const { data, loading, error } = useQuery(GET_REPOSITORY, {
        variables: { name: repositoryName, owner: userId, length: 10 },
    });

    if (loading) {
        return <div>...loading</div>;
    }

    if (error) {
        return <div>Cannot retrieve repository</div>;
    }
    console.log(data);

    const {
        name,
        issues,
        stargazerCount,
        watchers: { totalCount },
    } = data.repository as any;
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
                    {issues.nodes.map((it: any) => {
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
