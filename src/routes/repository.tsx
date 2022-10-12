import { FC } from 'react';
import { ApolloQueryResult } from '@apollo/client';
import { LoaderFunction, useLoaderData, Form, Outlet } from 'react-router-dom';
import graphqlClient from '../graphQL/client';
import { GetRepositoryDocument, GetRepositoryQuery } from '../graphQL/generated-types';
import { differenceInDays } from '../utils';

export const loader: LoaderFunction = async ({ params }) => {
    const { userId, repositoryName } = params;

    try {
        const result = await graphqlClient.query({
            query: GetRepositoryDocument,
            variables: { owner: userId, name: repositoryName, first: 10 },
            fetchPolicy: 'no-cache',
        });

        return result;
    } catch (e: any) {
        return { error: e.message, loading: false };
    }
};

const Repository: FC = () => {
    const result = useLoaderData() as ApolloQueryResult<GetRepositoryQuery>;

    if (result.error) {
        return <p className="text-error text-center mt-40">Cannot retrieve repository</p>;
    }

    const {
        id,
        name,
        issues,
        stargazerCount,
        watchers: { totalCount },
    } = result.data.repository;

    return (
        <div className="w-container mx-auto">
            <div>
                <div className="mt-24 flex justify-between items-center">
                    <h1 className="text-5xl">{name}</h1>
                    <span className="text-xl">
                        {stargazerCount} Stars • {totalCount} Watching
                    </span>
                </div>
                <div>
                    <div className="flex justify-between mt-12 mb-3">
                        <h2 className="font-bold text-xl">Open issues</h2>
                        <Form action="new-issue">
                            <button type="submit" className="text-lg px-12 py-1 bg-success">
                                Create issue
                            </button>
                        </Form>
                    </div>

                    {issues.nodes.length === 0 && <p>No issues have been opened</p>}
                    {issues.nodes.length > 0 && (
                        <ul>
                            {issues.nodes.map(({ id, title, createdAt, number, author: { login } }) => {
                                const createdAtDate = new Date(createdAt);
                                const daysFromNow = differenceInDays(new Date(), createdAtDate);

                                return (
                                    <li key={id} className="px-1 py-4 border-t last:border-b">
                                        <h3 className="mb-1 font-bold text-lg">{title}</h3>
                                        <span className="text-gray1 text-sm">
                                            #{number} opened{' '}
                                            <span title={createdAtDate.toString()}>{daysFromNow} days ago</span> by{' '}
                                            {login}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <Outlet context={{ repositoryId: id }} />
                </div>
            </div>
        </div>
    );
};

export default Repository;
