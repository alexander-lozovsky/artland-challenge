import { FC } from 'react';
import { LoaderFunction } from 'react-router-dom';
import graphqlClient from '../graphQL/client';
import Searchbox from '../components/Searchbox';
import RepositoryPageContent from '../components/RepositoryPageContent';
import { GetRepositoryDocument } from '../graphQL/generated-types';

const Repository: FC = () => {
    return (
        <div className="w-container mx-auto pt-32">
            <Searchbox />
            <RepositoryPageContent />
        </div>
    );
};

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

export default Repository;
