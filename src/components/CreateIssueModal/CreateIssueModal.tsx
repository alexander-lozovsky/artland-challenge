import { FC, FormEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { GetRepositoryDocument, useCreateIssueMutation } from '../../graphQL/generated-types';

interface ICreateIssueModalProps {
    onClose: () => void;
    repositoryId: string;
}

const CreateIssueModal: FC<ICreateIssueModalProps> = ({ onClose, repositoryId }) => {
    const modalRoot = useMemo(() => document.getElementById('modal-root'), []);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [createIssue, { loading, error }] = useCreateIssueMutation({ refetchQueries: [GetRepositoryDocument] });

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createIssue({ variables: { input: { repositoryId: repositoryId, title, body: description } } });

        onClose();
    };

    const modal = (
        <div
            className="fixed flex items-center justify-center w-screen h-screen top-0 left-0 bg-black/25"
            onClick={onClose}
        >
            <div className="w-[600px] bg-white py-3 px-8" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h1 className="font-bold text-2xl">Create New Issue</h1>
                    {!!error && <p className="text-rose-600">Cannot create issue, please try again</p>}
                </div>
                <form onSubmit={onFormSubmit}>
                    <input
                        className="block w-full border mt-6 p-2"
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className="block w-full border mt-5 p-2 resize-none"
                        name="description"
                        rows={8}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="text-right mt-12">
                        <button type="button" className="text-base px-4 py-2 bg-rose-400 mr-2" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="text-base px-4 py-2 bg-green-400" disabled={loading}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, modalRoot);
};

export default CreateIssueModal;
