import { FC, FormEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import styles from './createIssueModal.module.css';
import { ICreateIssuePayload } from '../../types';

interface ICreateIssueModalProps {
    onClose: () => void;
    onCreate: (payload: ICreateIssuePayload) => void;
    isSubmitting?: boolean;
}

const CreateIssueModal: FC<ICreateIssueModalProps> = ({ onClose, onCreate, isSubmitting }) => {
    const modalRoot = useMemo(() => document.getElementById('modal-root'), []);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onCreate({ title, description });
    };

    const modal = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <h1>Create New Issue</h1>
                <form onSubmit={onFormSubmit}>
                    <input
                        className={styles.titleInput}
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className={styles.descriptionInput}
                        name="description"
                        rows={8}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className={styles.buttons}>
                        <button type="button" className={cn(styles.button, styles.cancelBtn)} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={cn(styles.button, styles.createBtn)} disabled={isSubmitting}>
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
