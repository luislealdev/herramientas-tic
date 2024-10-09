import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';


export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
    },

    callbacks: {
        authorized() {
            return true;
        },

        jwt({ token, user }) {
            if (user) {
                token.data = user;
            }

            return token;
        },

        session({ session, token }) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.user = token.data as any;
            return session

        },
    },



    providers: [
        Credentials({
            async authorize(credentials) {

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);


                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;


                // Buscar el correo
                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
                if (!user) return null;

                // Comparar las contraseñas
                if (!bcryptjs.compareSync(password, user.password)) return null;


                // Regresar el usuario sin el password
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...rest } = user;

                return rest;
            },
        }),


    ]
}



export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);