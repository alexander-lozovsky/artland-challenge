import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from '../Repositories';
import { useGetUsersQuery } from '../../graphQL/generated-types';
import styles from './users.module.css';
import cn from 'classnames';
import Loader from '../Loader';

interface IUsersProps {
    query: string;
}

const Users: FC<IUsersProps> = ({ query }) => {
    // TODO add lazy-loading
    const { data, loading, error } = useGetUsersQuery({ variables: { query: `${query} type:user`, first: 20 } });
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedUser = searchParams.get('selectedUser');

    if (loading) {
        return <Loader className={styles.loader} />;
    }

    if (error) {
        return <div>cannot retrieve users</div>;
    }

    const usersNodes = data.search.nodes;
    if (usersNodes.length === 0) {
        return <p>We couldn't find any users</p>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.searchResultsTitle}>Results</h2>
            {usersNodes.length === 0 && <p>We couldn't find any users</p>}
            {usersNodes.length > 0 && (
                <div className={styles.usersListWrapper}>
                    <h3 className={styles.usersListTitle}>Users</h3>
                    <ul className={styles.usersList}>
                        {usersNodes.map((node) => {
                            switch (node.__typename) {
                                case 'User': {
                                    const { login, name, repositories, starredRepositories } = node;

                                    const onUserSelect = () => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            selectedUser: login,
                                        });
                                    };

                                    return (
                                        <li key={login} className={styles.userCard}>
                                            <button
                                                type="button"
                                                onClick={onUserSelect}
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
                    <hr />
                    <Repositories login={selectedUser} />
                </div>
            )}
        </div>
    );
};

export default Users;
