import { NavBar } from '../container';

export type ErrorPageProps = {
    errorMessage?: string | string[];
};

export function ErrorPage({ errorMessage }: ErrorPageProps) {
    if (typeof errorMessage === 'string') {
        return <NavBar>{errorMessage}</NavBar>;
    }
    return (
        <NavBar>
            {errorMessage?.map((e: string, i: number) => (
                <div key={i}>{e}</div>
            ))}
        </NavBar>
    );
}
