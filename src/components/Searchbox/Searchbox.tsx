import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Searchbox = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/?query=${searchQuery}`);
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    return (
        <div>
            <form onSubmit={onSubmit} className="flex justify-center gap-4">
                <input
                    type="search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={onChange}
                    className="w-64 p-3 text-xl border-solid border-2 border-primary rounded-lg"
                />
                <button type="submit" className="px-10 bg-primary text-white text-xl rounded-lg">
                    Search
                </button>
            </form>
        </div>
    );
};

export default Searchbox;
