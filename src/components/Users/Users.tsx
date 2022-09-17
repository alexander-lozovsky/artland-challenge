import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Repositories from '../Repositories';
import { useGetUsersQuery } from '../../graphQL/generated-types';
import Loader from '../Loader';
import { NetworkStatus } from '@apollo/client';

interface IUsersProps {
    query: string;
}

// TODO add active state styles
// .userCardButton.active::after {
//     display: block;
//     content: '';
//     width: 200px;
//     height: 2px;
//     position: absolute;
//     bottom: -20px;
//     background: blue;
// }

const Users: FC<IUsersProps> = ({ query }) => {
    // TODO add lazy-loading
    const { data, error, fetchMore, networkStatus } = useGetUsersQuery({
        variables: { query: `${query} type:user`, first: 10 },
        notifyOnNetworkStatusChange: true,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedUser = searchParams.get('selectedUser');

    if (networkStatus === NetworkStatus.loading) {
        return <Loader className="h-40" />;
    }

    if (error) {
        return <p className="text-rose-600 text-center mt-5">Cannot retrieve users, please try again</p>;
    }

    const { nodes, userCount, pageInfo } = data.search;

    const onNextClick = () => {
        if (pageInfo.hasNextPage) {
            fetchMore({ variables: { query: `${query} type:user`, first: 10, afterCursor: pageInfo.endCursor } });
        }
    };

    return (
        <div className="w-[1200px] mx-auto">
            <h2 className="my-5 text-xl text-center text-slate-500">Results: {userCount} users</h2>
            {nodes.length === 0 && <p className="text-center">We couldn't find any users</p>}
            {nodes.length > 0 && (
                <div>
                    <ul className="flex gap-2 overflow-y-scroll pb-6">
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
                                        <li key={login}>
                                            <button
                                                type="button"
                                                onClick={onUserSelect}
                                                className="group bg-black text-white rounded-2xl w-72 h-40 hover:bg-blue-800 hover:bg-[url('../public/Octocat.png')] hover:bg-contain hover:bg-no-repeat hover:bg-center"
                                            >
                                                <h4 className="text-xl font-bold group-hover:invisible">
                                                    {name || login}
                                                </h4>
                                                <span className="text-gray-100 group-hover:invisible">
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
                            <li key="loader" className="self-center">
                                <Loader />
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
