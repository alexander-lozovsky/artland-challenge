import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import Users from '../components/Users';
import Searchbox from '../components/Searchbox';

const Root: FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    return (
        <div className="pt-32">
            <Searchbox />
            {query && <Users query={query} />}
        </div>
    );
};

export default Root;
