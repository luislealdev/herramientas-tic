'use client';
import Link from "next/link";
import { FiMenu, FiHome, FiList, FiTool } from "react-icons/fi";
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
        <div >
            <div className=" align-center relative">
                {/* Botón de menú */}
                <button onClick={toggleMenu} className={`${styles.menuBtn}`} arial-label="Toggle menu">
                    <FiMenu className={styles.icon} />
                </button>

                {/* Menú lateral superpuesto */}
                {isMenuOpen && (
                    <div 
                    className={`${styles.sideMenuOverlay} ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}>
                        <div className={`{styles.sideMenu} ${isMenuOpen ? 'open' : ''}`}>
                            <ul className={styles.icon}>
                                <li >
                                    <Link href="/admin/tic" className="flex align-center">
                                        <FiTool className={styles.icon} />
                                        Herramientas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/category"  className="flex align-center">
                                        <FiList className={styles.icon} />
                                        Categorías
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin"  className="flex align-center">
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