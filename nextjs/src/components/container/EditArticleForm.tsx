import React from 'react';
import { useArticles } from '../hooks';
import Article from '../../domains/article';
import { EditArticleFormComponent } from '../presentational/EditArticleFormComponent';

export type EditArticleFormProps = {
    article?: Article;
};

export function EditArticleForm({ article }: EditArticleFormProps) {
    const [currentArticle, setCurrentArticle] = React.useState<undefined | Article>(article);
    const { create, update } = useArticles();
    const onSubmit = React.useCallback(
        async (content: string) => {
            const title = content?.split('\n').find((e) => e) || '';
            if (currentArticle) {
                const result = await update(
                    new Article({
                        id: currentArticle.id,
                        title,
                        content,
                    })
                );
                if (result === true) {
                    alert('更新しました');
                } else {
                    alert('更新に失敗しました');
                }
            } else {
                const result = await create({ title, content });
                if (result instanceof Article) {
                    setCurrentArticle(result);
                    alert('作成しました');
                    return;
                } else {
                    alert('作成に失敗しました');
                }
            }
        },
        [create, currentArticle, update]
    );
    return <EditArticleFormComponent onSubmit={onSubmit} />;
}
