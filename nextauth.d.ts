import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
        } & DefaultSession['user'];
    }
}