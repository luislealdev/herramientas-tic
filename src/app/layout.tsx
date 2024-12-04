import type { Metadata } from "next";
import './globals.css';
import { Providers } from "@/components/providers/Providers";
import 'carbon-components/css/carbon-components.min.css';
import Link from "next/link";


export const metadata: Metadata = {
  title: "Ticnify | Herramientas de gestión de proyectos",
  description: "Herramientas TIC para gestores de proyectos de desarrollo de software y sistemas de información.",
  keywords: "herramientas TIC, gestión de proyectos, desarrollo de software, sistemas de información",
  openGraph: {
    title: "Herramientas de gestión de proyectos de desarrollo de software",
    description: "Herramientas TIC para gestores de proyectos de desarrollo de software y sistemas de información.",
    url: "https://herramientas-tic-one.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://herramientas-tic-one.vercel.app/img/logo.png",
        width: 800,
        height: 600,
        alt: "Herramientas TIC",
      },
    ],
  },
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Get the current year
  const year = new Date().getFullYear(

  );

  return (
    <html lang="es-co">
      <head>
        <link rel="stylesheet" href="https://luisrrleal.com/styles/leal-styles.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
      </head>
      <body>
        <Providers>
          <nav className="flex space-between p-20 align-center gap-25">
            <div className="flex align-center gap-25 ">


            <Link href="/">
              <h6 className="black-text menu-item">Ticnify Menú</h6>
            </Link>

            <hr style={{ width: 20 }} />
            
            <Link href="/" className="gray-text menu-item"> Herramientas </Link>
            
            <Link href="/admin" className="gray-text menu-item"> Admin </Link>
            
            <Link href="/contacto" className="gray-text menu-item"> Contacto </Link>
            
            </div>
   
          </nav>
          {children}
          <footer className="p-20 bg-gray-m mt-50">
            <p className="center-text">Ticnify {year} © Todos los derechos reservados</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
