'use client';
//import React, {useState} from "react";
//import Link from 'next/link';
import Dashboard from "./dashboard/Dashboard";
//import { FiDatabase, FiMenu, FiHome } from "react-icons/fi";
//import styles from './AdminBoard.module.css';

const AdminBoard = () => {

    
    return (

        <div>
            <div >
                <div>
                    <h1 style={{ fontFamily: "'IBM Plex Sans', sans-serif" , padding: '10px', fontSize: '50px' } }>Dashboard</h1>
                </div>
            
                {/* Seccion de Estadísticas */}
                <div>
                    <h2 style={{padding: '30px'}}>Estadisticas Generales</h2>
                    
                    <Dashboard />
                    {/* Aqui se agrega info si se quiere poner por debajo del boton de menu */}
                    
                </div>

            </div>
        </div>
    )
};
export default AdminBoard;