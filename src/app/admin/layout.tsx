import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Menu from "@/components/admin/Menu";
import styles from '@/components/admin/AdminBoard.module.css';


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
        <section className={styles.adminContainer }>
            <div className="flex p-10">
                    <Menu />
                <div>
                    {children}
                </div>
            </div>
        </section>
    );
}
