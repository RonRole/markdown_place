import { Search } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material"
import React from "react";

export type ArticleSearchFormProps = {
    onSubmit(query?:string) : Promise<void>
} & Omit<TextFieldProps,'InputProps' | 'placeholder' | 'inputRef' | 'onSubmit'>

export default function ArticleSearchForm({onSubmit}: ArticleSearchFormProps) {
    const searchFieldInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        await onSubmit(searchFieldInputRef.current?.value);
    }, []);
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                placeholder="検索フォームでやんす"
                inputRef={searchFieldInputRef}
                fullWidth
            />
        </form>
    )
}