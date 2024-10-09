'use client';
import { authenticate } from "@/actions/auth/login";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import bcryptjs from 'bcryptjs';

export const LoginForm = () => {

    console.log(bcryptjs.hashSync('123456'));
    

    const [state, dispatch] = useFormState(authenticate, undefined);

    useEffect(() => {
        if (state === 'Success') {
            window.location.replace('/admin');
        }

    }, [state]);

    return (
        <form action={dispatch}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Login</button>
        </form>
    )
}
