import { Button } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import {
    ArticleSearchForm,
    EditNewArticleDialog,
    NavBar,
    RequireAuthorized,
} from '../../components/container';
import { EditNewArticleDialogContext } from '../../components/context/EditNewArticleDialogContextProvider';

export default function Articles() {
    const onSubmit = React.useCallback(async (query?: string) => {
        console.log(query);
        console.log('kandakengo');
    }, []);
    return (
        <RequireAuthorized>
            <EditNewArticleDialogContext.Consumer>
                {({ open, close }) => (
                    <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={open}>Open!</Button>
                        <Container maxWidth="sm" sx={{ mt: 2 }}>
                            <ArticleSearchForm onSubmit={onSubmit} />
                        </Container>
                    </Container>
                )}
            </EditNewArticleDialogContext.Consumer>
        </RequireAuthorized>
    );
}
