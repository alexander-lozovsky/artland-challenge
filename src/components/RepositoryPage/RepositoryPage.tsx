import { FC } from 'react';
import Searchbox from '../Searchbox';
import RepositoryPageContent from '../RepositoryPageContent';

const RepositoryPage: FC = () => {
    return (
        <div className="w-[1200px] mx-auto pt-32">
            <Searchbox />
            <RepositoryPageContent />
        </div>
    );
};

export default RepositoryPage;
