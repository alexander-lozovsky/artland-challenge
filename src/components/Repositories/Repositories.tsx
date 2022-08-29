import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserRepositoriesQuery } from '../../graphQL/generated-types';
import Loader from '../Loader';
import styles from './repositories.module.css';

interface IRepositoriesProps {
    login: string;
}

const Repositories: FC<IRepositoriesProps> = ({ login }) => {
    // TODO add pagination
    // TODO sometimes it receives repos that have already been deleted. Figure out how to filter them
    const { data, loading, error } = useGetUserRepositoriesQuery({ variables: { login, first: 10 } });

    if (loading) {
        return <Loader />;
    }

    // TODO add styling
    if (error) {
        return <div>cannot retrieve repositories</div>;
    }

    const items = data.user.repositories.nodes;

    return (
        <div>
            <h3>{login} repositories</h3>
            {/* TODO add styling */}
            {items.length === 0 && <p>User has no repositories yet</p>}
            {items.length > 0 && (
                <ul className={styles.repositoriesList}>
                    {items.map((it) => (
                        <li key={it.id} className={styles.repository}>
                            <Link to={`users/${login}/repositories/${it.name}`}>
                                <span className={styles.repositoryName}>{it.name}</span>
                                <span className={styles.repositoryStats}>
                                    {it.stargazerCount} Stars • {it.watchers.totalCount} Watching
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Repositories;
