import { Container } from '@mui/system';
import React from 'react';
import { ArticleSearchForm, NavBar, RequireAuthorized } from '../../components/container';

export default function Articles() {
    const onSubmit = React.useCallback(async (query?: string) => {
        console.log(query);
        console.log('kandakengo');
    }, []);
    return (
        <RequireAuthorized>
            <NavBar>
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Container maxWidth="sm" sx={{ mt: 2 }}>
                        <ArticleSearchForm onSubmit={onSubmit} />
                    </Container>
                </Container>
            </NavBar>
        </RequireAuthorized>
    );
}
