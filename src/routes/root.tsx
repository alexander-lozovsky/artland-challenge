import { FC, ChangeEvent, useState } from 'react';
import { useSearchParams, Outlet, Form } from 'react-router-dom';

const Root: FC = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    return (
        <div className="pt-24">
            <div>
                <Form className="flex justify-center gap-4" method="get" action="search">
                    <input
                        type="search"
                        placeholder="Search users..."
                        value={searchQuery}
                        name="query"
                        onChange={onChange}
                        className="w-64 p-3 text-xl border-solid border-2 border-primary rounded-lg"
                    />
                    <button type="submit" className="px-10 bg-primary text-white text-xl rounded-lg">
                        Search
                    </button>
                </Form>
            </div>
            <Outlet />
        </div>
    );
};

export default Root;
