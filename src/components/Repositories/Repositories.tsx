import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserRepositoriesQuery } from '../../@generated/graphql';

interface IRepositoriesProps {
    login: string;
}

const Repositories: FC<IRepositoriesProps> = ({ login }) => {
    const { data, loading, error } = useGetUserRepositoriesQuery({ variables: { login, first: 10 } });

    if (loading) {
        return <div>...loading</div>;
    }

    if (error) {
        return <div>cannot retrieve repositories</div>;
    }

    const items = data.user.repositories.nodes;

    return (
        <div>
            <h3>{login} repositories</h3>
            {items.length === 0 && <p>User has no repositories yet</p>}
            {items.length > 0 && (
                <ul>
                    {items.map((it) => (
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
