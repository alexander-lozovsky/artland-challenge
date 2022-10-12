import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserRepositoriesQuery } from '../../graphQL/generated-types';
import Loader from '../Loader';

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

    if (error) {
        return <div className="text-error">Cannot retrieve repositories</div>;
    }

    const items = data.user.repositories.nodes;

    return (
        <div>
            <h3 className="my-5 font-bold text-2xl">{login} repositories</h3>
            {items.length === 0 && <p className="my-5">User has no repositories yet</p>}
            {items.length > 0 && (
                <ul>
                    {items.map((it) => (
                        <li key={it.id}>
                            <Link
                                to={`/users/${login}/repositories/${it.name}`}
                                className="flex w-full justify-between items-center py-2 px-1 hover:bg-gray2"
                            >
                                <span className="text-xl">{it.name}</span>
                                <span className="text-gray1">
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
