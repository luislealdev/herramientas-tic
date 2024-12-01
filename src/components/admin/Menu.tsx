'use client';
import Link from "next/link";
import { FiMenu, FiHome, FiDatabase } from "react-icons/fi";
import styles from "@/components/admin/AdminBoard.module.css";
import { useState } from "react";

const Menu = () => {
    

    // Estado para manejar el menú y submenú
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle para abrir o cerrar el menú lateral
        };

    return (
        <div className="flex end align-center relative">
            <div className="flex end align-center relative">
                {/* Botón de menú */}
                <button onClick={toggleMenu} className="menu-btn btn-right">
                    <FiMenu className={styles.icon} />
                </button>

                {/* Menú lateral superpuesto */}
                {isMenuOpen && (
                    <div className={`${styles.sideMenuOverlay} ${isMenuOpen ? styles.open : ''}`}>
                        <div className={styles.sideMenu}>
                            <ul className={styles.icon}>
                                <li>
                                    <Link href="/admin/tic">
                                        <FiDatabase className={styles.icon} />
                                        Herramientas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/category">
                                        <FiDatabase className={styles.icon} />
                                        Categorías
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/">
                                        <FiHome className={styles.icon} />
                                        Menú
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};
export default Menu;