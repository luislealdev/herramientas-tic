'use client';
import React, {useState} from "react";
import Link from 'next/link';
import Dashboard from "./dashboard/Dashboard";
import { FiHome, FiMenu, FiTable } from "react-icons/fi";
import styles from './AdminBoard.module.css';

const AdminBoard = () => {


    // Estado para manejar el menú y submenú
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle para abrir o cerrar el menú lateral
    };
    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen); // Toggle para abrir o cerrar el submenú
    };
    
    return (

        <div>


            <div className={styles.chartContainer}>
                <div>
                <button onClick={toggleMenu} className="menu-btn">
                        
                        <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
                            
                            <ul>
                                <li onClick={toggleSubMenu} className={styles.menuItem}>
                                <FiMenu className={styles.icon} />
                                    {isSubMenuOpen && (
                                        <ul className={styles.subMenu}>
                                            <li>
                                                <Link href="/admin/tic">
                                                <div>
                                                    <FiTable className={styles.icon} />
                                                </div>
                                                Herramientas
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/category">
                                                <div>
                                                    <FiTable className={styles.icon} />
                                                </div>
                                                Categorias
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
    
                            </ul>
                        </div>
                </button>
                
                    <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif" , padding: '10px', fontSize: '50px' } }>Dashboard</h1>
                </div>
            
                {/* Seccion de Estadísticas */}
                <div>
                    <h2 style={{padding: '30px'}}>Estadisticas Generales</h2>
                    
                    <Dashboard />
                    {/* Aqui se agrega info si se quiere poner por debajo del boton de menu */}
                    
                </div>

                    <Link href="/" className={styles.backButton}>
                    <button className="btn-left">
                        <FiHome className={styles.icon}/>
                    </button>
                    </Link>
                
                {/*<ToolsTable/>*/}
            </div>
        </div>
    )
};
export default AdminBoard;