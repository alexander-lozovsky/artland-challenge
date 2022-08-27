import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from '../Repositories';
import { useGetUsersQuery } from '../../@generated/graphql';
import styles from './users.module.css';
import cn from 'classnames';

interface IUsersProps {
    query: string;
}

const Users: FC<IUsersProps> = ({ query }) => {
    const { data, loading, error } = useGetUsersQuery({ variables: { query: `${query} type:user`, first: 20 } });
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
        <div className={styles.container}>
            <h2 className={styles.searchResultsTitle}>Results</h2>
            {items.length === 0 && <p>We couldn't find any users</p>}
            {items.length > 0 && (
                <div className={styles.usersListWrapper}>
                    <h3 className={styles.usersListTitle}>Users</h3>
                    <ul className={styles.usersList}>
                        {items.map(({ node }) => {
                            switch (node.__typename) {
                                case 'User': {
                                    const { login, name, repositories, starredRepositories } = node;

                                    return (
                                        <li key={login} className={styles.userCard}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchParams({
                                                        ...Object.fromEntries(searchParams.entries()),
                                                        selectedUser: login,
                                                    });
                                                }}
                                                className={cn(styles.userCardButton, {
                                                    [styles.active]: selectedUser === login,
                                                })}
                                            >
                                                <h4 className={styles.userName}>{name || login}</h4>
                                                <span className={styles.userStats}>
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
                </div>
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

export default Users;
