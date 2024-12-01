import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Logs",
    description: "Visualización de logs del sistema",
};

export default async function LogsLayout({
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