import React from 'react';
import styles from './errorBoundary.module.css';

interface IErrorBoundaryProps {
    children: React.ReactElement;
}

interface IErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.wrapper}>
                    <h1>
                        Something went wrong, please go to the <a href="/">home page</a> and start again
                    </h1>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
