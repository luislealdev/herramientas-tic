import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administración",
    description: "Administración de la plataforma",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <section>
            {children}
        </section>
    );
}
