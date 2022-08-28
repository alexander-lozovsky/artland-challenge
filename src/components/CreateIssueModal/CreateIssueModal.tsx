import { FC, FormEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import styles from './createIssueModal.module.css';

interface CreateIssuePayload {
    title: string;
    description?: string;
}

interface ICreateIssueModalProps {
    onClose: () => void;
    onCreate: (payload: CreateIssuePayload) => void;
    isSubmitting?: boolean;
}

const CreateIssueModal: FC<ICreateIssueModalProps> = ({ onClose, onCreate, isSubmitting }) => {
    const modalRoot = useMemo(() => document.getElementById('modal-root'), []);

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries()) as unknown as CreateIssuePayload;

        onCreate(data);
    };

    const modal = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <h1>Create New Issue</h1>
                <form onSubmit={onFormSubmit}>
                    <input className={styles.titleInput} type="text" name="title" placeholder="Title" required />
                    <textarea
                        className={styles.descriptionInput}
                        name="description"
                        rows={8}
                        placeholder="Description"
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
