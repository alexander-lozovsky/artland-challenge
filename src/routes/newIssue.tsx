import { FC, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    useOutletContext,
    useNavigate,
    ActionFunction,
    redirect,
    Form,
    useActionData,
    useNavigation,
} from 'react-router-dom';
import graphqlClient from '../graphQL/client';
import { CreateIssueDocument } from '../graphQL/generated-types';

const NewIssue: FC = () => {
    const { repositoryId } = useOutletContext() as { repositoryId: string };
    const navigate = useNavigate();

    const modalRoot = useMemo(() => document.getElementById('modal-root'), []);
    const error = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const onClose = () => navigate(-1);

    const modal = (
        <div
            className="fixed flex items-center justify-center w-screen h-screen top-0 left-0 bg-overlay"
            onClick={onClose}
        >
            <div className="w-[600px] bg-white py-3 px-8" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h1 className="font-bold text-2xl">Create New Issue</h1>
                    {!!error && <p className="text-error">Cannot create issue, please try again</p>}
                </div>
                <Form method="post">
                    <input
                        className="block w-full border mt-6 p-2"
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                    />
                    <textarea
                        className="block w-full border mt-5 p-2 resize-none"
                        name="description"
                        rows={8}
                        placeholder="Description"
                    />
                    <input hidden type="text" defaultValue={repositoryId} name="repositoryId" />

                    <div className="text-right mt-12">
                        <button type="button" className="text-base px-4 py-2 bg-error mr-2" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="text-base px-4 py-2 bg-success" disabled={isSubmitting}>
                            Create
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );

    return createPortal(modal, modalRoot);
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
