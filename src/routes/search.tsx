import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from '../components/Repositories';
import { useGetUsersQuery } from '../graphQL/generated-types';
import Loader from '../components/Loader';

const Search: FC = () => {
    // TODO add lazy-loading
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { data, error, loading } = useGetUsersQuery({
        variables: { query: `${query} type:user`, first: 10 },
    });

    const selectedUser = searchParams.get('selectedUser');

    if (loading) {
        return <Loader className="h-40" />;
    }

    if (error) {
        return <p className="text-error text-center mt-5">Cannot retrieve users, please try again</p>;
    }

    const { nodes, userCount } = data.search;

    return (
        <div className="w-container mx-auto">
            <h2 className="my-5 text-xl text-center text-gray1">Results: {userCount} users</h2>
            {nodes.length === 0 && <p className="text-center">We couldn't find any users</p>}
            {nodes.length > 0 && (
                <div>
                    <ul className="flex gap-2 overflow-y-scroll pb-6">
                        {nodes.map((node) => {
                            switch (node.__typename) {
                                case 'User': {
                                    const { login, name, repositories, starredRepositories } = node;
                                    const isActive = selectedUser === login;

                                    const onUserSelect = () => {
                                        setSearchParams({
                                            ...Object.fromEntries(searchParams.entries()),
                                            selectedUser: login,
                                        });
                                    };

                                    const activeClasses =
                                        "after:content-[''] after:block after:w-64 after:h-0.5 after:bg-primary after:absolute after:bottom-[-20px] after:left-1/2 after:-translate-x-1/2";

                                    return (
                                        <li key={login} className={`relative ${isActive ? activeClasses : ''}`}>
                                            <button
                                                type="button"
                                                onClick={onUserSelect}
                                                className="group bg-black text-white rounded-2xl w-72 h-40 hover:bg-primary hover:bg-[url('../public/Octocat.png')] hover:bg-contain hover:bg-no-repeat hover:bg-center"
                                            >
                                                <h4 className="text-xl font-bold group-hover:invisible">
                                                    {name || login}
                                                </h4>
                                                <span className="group-hover:invisible">
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
                        {loading && (
                            <li key="loader" className="self-center">
                                <Loader />
                            </li>
                        )}
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

export default Search;
