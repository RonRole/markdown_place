/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export type LoaderProps<LoadResult> = {
    load(): Promise<LoadResult>;
    reloadDeps?: React.DependencyList;
    children(loading: boolean, loadResult: LoadResult | null): React.ReactNode;
};

export function Loader<LoadResult>({ load, reloadDeps = [], children }: LoaderProps<LoadResult>) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadResult, setLoadResult] = React.useState<LoadResult | null>(null);
    React.useEffect(() => {
        setLoading(true);
        load()
            .then((result) => setLoadResult(result))
            .finally(() => setLoading(false));
    }, [load, ...reloadDeps]);
    const chilrenMemo = React.useMemo(
        () => children(loading, loadResult),
        [children, loadResult, loading]
    );
    return <>{chilrenMemo}</>;
}
