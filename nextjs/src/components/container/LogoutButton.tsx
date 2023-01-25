import { Button, ButtonProps, Typography } from '@mui/material';
import React from 'react';
import { AuthContext } from '../context/AuthContextProvider';

export type LogoutButtonProps = Omit<ButtonProps, 'variant' | 'color' | 'onClick' | 'disabled'>;

export function LogoutButton(props: LogoutButtonProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const { logout } = React.useContext(AuthContext);
    const onClick = React.useCallback(async () => {
        setSubmitting(true);
        await logout();
        setSubmitting(false);
    }, [logout]);
    return (
        <Button
            variant="contained"
            color="error"
            onClick={onClick}
            disabled={submitting}
            {...props}
        >
            log out
        </Button>
    );
}
