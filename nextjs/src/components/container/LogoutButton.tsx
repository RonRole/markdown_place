import { Button } from "@mui/material"
import React from "react";
import { AuthContext } from "../context/AuthContextProvider"

export function LogoutButton() {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const {logout} = React.useContext(AuthContext);
    const onClick = React.useCallback(async ()=>{
        setSubmitting(true);
        await logout();
        setSubmitting(false);
    }, [logout])
    return (
        <Button variant="outlined" color="error" onClick={onClick} disabled={submitting}>LOG OUT</Button>
    )
}