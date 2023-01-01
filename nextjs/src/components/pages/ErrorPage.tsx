export type ErrorPageProps = {
    errorMessage: string | string[];
};

export function ErrorPage({ errorMessage }: ErrorPageProps) {
    if (Array.isArray(errorMessage)) {
        return (
            <div>
                {errorMessage.map((e: string, i: number) => (
                    <div key={i}>{e}</div>
                ))}
            </div>
        );
    }
    return <div>{errorMessage}</div>;
}
