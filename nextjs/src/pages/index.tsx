import React from 'react';
import { EditArticleForm, NavBar, RequireAuthorized } from '../components/container';

export default function Home() {
    return <EditArticleForm initialMode="create" />;
}
