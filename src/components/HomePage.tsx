import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from './Repositories';
import Searchbox from './Searchbox';
import { useGetUsersQuery } from '../@generated/graphql';

interface IUsersProps {
    query: string;
}

const Users: FC<IUsersProps> = ({ query }) => {
    const { data, loading, error } = useGetUsersQuery({ variables: { query: `${query} type:user`, first: 10 } });
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedUser = searchParams.get('selectedUser');

    if (loading) {
        return <div>...loading</div>;
    }

    if (error) {
        return <div>cannot retrieve users</div>;
    }

    const items = data.search.edges;
    if (items.length === 0) {
        return <p>We couldn't find any users</p>;
    }

    return (
        <div>
            <h2>Results</h2>
            {items.length === 0 && <p>We couldn't find any users</p>}
            {items.length > 0 && (
                <ul>
                    {items.map(({ node }) => {
                        switch (node.__typename) {
                            case 'User': {
                                const { login, name, repositories, starredRepositories } = node;

                                return (
                                    <li key={login}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchParams({
                                                    ...Object.fromEntries(searchParams.entries()),
                                                    selectedUser: login,
                                                });
                                            }}
                                        >
                                            <span>{name || login} - </span>
                                            <span>
                                                {repositories.totalCount} Repositories •{' '}
                                                {starredRepositories.totalCount} Stars
                                            </span>
                                        </button>
                                    </li>
                                );
                            }

                            default:
                                return null;
                        }
                    })}
                </ul>
            )}
            {selectedUser && (
                <div>
                    <br />
                    <Repositories login={selectedUser} />
                </div>
            )}
        </div>
    );
};

const HomePage: FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    return (
        <div>
            <Searchbox />
            {query && <Users query={query} />}
        </div>
    );
};

export default HomePage;
