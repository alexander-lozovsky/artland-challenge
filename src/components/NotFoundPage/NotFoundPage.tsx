import { FC } from 'react';

const NotFoundPage: FC = () => {
    return (
        <div className="text-center absolute w-screen h-screen flex flex-col justify-center">
            <h1 className="text-8xl">404</h1>
            <p className="text-4xl pt-6">Page not found</p>
        </div>
    );
};

export default NotFoundPage;
