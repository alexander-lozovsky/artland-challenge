import { FC, ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate, useSearchParams, Outlet } from 'react-router-dom';

const Root: FC = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const navigate = useNavigate();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchQuery.length === 0) {
            navigate('/');
        } else {
            navigate(`/search?query=${searchQuery}`);
        }
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    return (
        <div className="pt-24">
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
            <Outlet />
        </div>
    );
};

export default Root;
