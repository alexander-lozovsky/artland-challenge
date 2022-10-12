import { FC } from 'react';
import { useOutletContext, useNavigate, ActionFunction, redirect } from 'react-router-dom';
import CreateIssueModal from '../components/CreateIssueModal';
import graphqlClient from '../graphQL/client';
import { CreateIssueDocument } from '../graphQL/generated-types';

const NewIssue: FC = () => {
    const { repositoryId } = useOutletContext() as { repositoryId: string };
    const navigate = useNavigate();

    return <CreateIssueModal onClose={() => navigate(-1)} repositoryId={repositoryId} />;
};

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const { title, description, repositoryId } = Object.fromEntries(formData);
    try {
        await graphqlClient.mutate({
            mutation: CreateIssueDocument,
            variables: { input: { repositoryId: repositoryId, title, body: description } },
        });
    } catch {
        return 'error';
    }
    const { userId, repositoryName } = params;

    return redirect(`/users/${userId}/repositories/${repositoryName}`);
};

export default NewIssue;
