import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { usePrefersColorScheme } from "../hooks";

export type PrefersColorSchemeMuiThemeProviderType = {
    children: React.ReactNode;
}

export function PrefersColorSchemeMuiThemeProvider({children}:PrefersColorSchemeMuiThemeProviderType) {
    const {current} = usePrefersColorScheme();
    const muiTheme = createTheme({
        palette: {
            mode: current
        }
    });
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}