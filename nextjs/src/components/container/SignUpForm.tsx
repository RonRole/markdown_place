import { useRouter } from "next/router";
import React from "react";
import { AuthContext } from "../context";
import SignUpFormCard, { SignUpFormCardProps, SignUpFormInput } from "../presentational/SignUpFormCard";

export type SignUpFormProps = Omit<SignUpFormCardProps, 'onSubmit'>;

export function SignUpForm(props: SignUpFormProps) {
    const router = useRouter();
    const {signUp} = React.useContext(AuthContext);
    const onSubmit = React.useCallback(async ({name, email, password, passwordConfirmation}: SignUpFormInput)=>{
        const successed = await signUp(name, email, password, passwordConfirmation);
        if(successed) {
            await router.push('/');
        }
    }, [signUp]);
    return (
        <SignUpFormCard onSubmit={onSubmit} {...props} />
    )
}