import React from "react";

export type UsePrefersColorSchemeReturnType = {
    current: 'light' | 'dark'
}

export default function usePrefersColorScheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const getThemeMode = React.useCallback(() => mediaQuery.matches ? 'dark' : 'light',[mediaQuery.matches]);
    const [current, setCurrent] = React.useState<UsePrefersColorSchemeReturnType['current']>(getThemeMode());
    React.useEffect(()=>{
        mediaQuery.addEventListener('change', (ev:MediaQueryListEvent)=>{
            const mediaQueryMode = mediaQuery.matches ? 'dark' : 'light';
            setCurrent(mediaQueryMode);
        });
    },[mediaQuery]);
    return {
        current
    }
}