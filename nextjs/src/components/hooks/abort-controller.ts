import React from 'react';

export type UseAbortControllerItems = {
    restartProcess(): AbortController['signal'];
    clearAbortSignal(): void;
};

export function useAbortController(): UseAbortControllerItems {
    const controllerRef = React.useRef<AbortController | null>(null!);
    const restartProcess = React.useCallback(() => {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        return controllerRef.current.signal;
    }, []);
    const clearAbortSignal = React.useCallback(() => {
        controllerRef.current = null;
    }, []);
    return {
        restartProcess,
        clearAbortSignal,
    };
}
