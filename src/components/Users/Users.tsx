import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from '../Repositories';
import { useGetUsersQuery } from '../../graphQL/generated-types';
import styles from './users.module.css';
import cn from 'classnames';
import Loader from '../Loader';
import { NetworkStatus } from '@apollo/client';

interface IUsersProps {
    query: string;
}

const Users: FC<IUsersProps> = ({ query }) => {
    // TODO add lazy-loading
    const { data, error, fetchMore, networkStatus } = useGetUsersQuery({
        variables: { query: `${query} type:user`, first: 10 },
        notifyOnNetworkStatusChange: true,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedUser = searchParams.get('selectedUser');

    if (networkStatus === NetworkStatus.loading) {
        return <Loader className={styles.loader} />;
    }

    if (error) {
        return <p className={styles.errorMessage}>Cannot retrieve users, please try again</p>;
    }

    const { nodes, userCount, pageInfo } = data.search;

    const onNextClick = () => {
        if (pageInfo.hasNextPage) {
            fetchMore({ variables: { query: `${query} type:user`, first: 10, afterCursor: pageInfo.endCursor } });
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.searchResultsTitle}>Results: {userCount} users</h2>
            {nodes.length === 0 && <p className={styles.noResultsNessage}>We couldn't find any users</p>}
            {nodes.length > 0 && (
                <div className={styles.usersListWrapper}>
                    <h3 className={styles.usersListTitle}>Users</h3>
                    <ul className={styles.usersList}>
                        {nodes.map((node) => {
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
                        {/* TODO consider refactoring */}
                        {networkStatus === NetworkStatus.fetchMore && (
                            <li key="loader" className={styles.userCard}>
                                <Loader className={styles.moreUsersLoader} />
                            </li>
                        )}
                    </ul>
                    <button type="button" onClick={onNextClick} disabled={networkStatus === NetworkStatus.fetchMore}>
                        next
                    </button>
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
