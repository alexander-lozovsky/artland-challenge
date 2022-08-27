import { FC } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

// the query can retrieve repos that are already deleted, find a way to filter them
const GET_USERS_REPOSITORIES = gql`
    query GetUserRepositories($login: String!, $repositoryCursor: String) {
        user(login: $login) {
            repositories(first: 5, after: $repositoryCursor) {
                nodes {
                    name
                    watchers {
                        totalCount
                    }
                    stargazerCount
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;
interface IRepositoriesProps {
    login: string;
}

const Repositories: FC<IRepositoriesProps> = ({ login }) => {
    const { data, loading, error } = useQuery(GET_USERS_REPOSITORIES, { variables: { login } });
    if (loading) {
        return <div>...loading</div>;
    }

    if (error) {
        return <div>cannot retrieve repositories</div>;
    }
    console.log(data);

    const items = data.user.repositories.nodes;
    return (
        <div>
            <h3>{login} repositories</h3>
            {items.length === 0 && <p>User has no repositories yet</p>}
            {items.length > 0 && (
                <ul>
                    {items.map((it: any) => (
                        <li key={it.name}>
                            <Link to={`users/${login}/repositories/${it.name}`}>
                                <span>{it.name} - </span>
                                <span>{it.stargazerCount} Stars • </span>
                                <span>{it.watchers.totalCount} Watching</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Repositories;
