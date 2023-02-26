import React from 'react';
import { AuthContext } from '../../context';
import { Loader, LoaderProps } from './Loader';

export type ReloadOnAuthStatusChangedLoaderProps<LoadResult> = Omit<
    LoaderProps<LoadResult>,
    'reloadDeps'
>;

export function ReloadOnAuthStatusChangedLoader<LoadResult>({
    children,
    load,
}: ReloadOnAuthStatusChangedLoaderProps<LoadResult>) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    return (
        <Loader load={load} reloadDeps={[currentAuthStatus.isFixedAsAuthorized]}>
            {children}
        </Loader>
    );
}
