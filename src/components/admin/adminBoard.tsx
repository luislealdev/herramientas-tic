"use client";
import React, { useState } from 'react';
import styles from './AdminBoard.module.css';
import { FiEdit2, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
// import { FiSearch, FiEdit2, FiFilter } from 'react-icons/fi'; // Para los iconos

const AdminBoard = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const rows = [
    { name: 'Herramienta 1', date: '2024-10-10', description: 'Descripción 1', logo: 'Logo 1' },
    { name: 'Herramienta 2', date: '2024-09-15', description: 'Descripción 2', logo: 'Logo 2' },
    // Agrega más filas según sea necesario
  ];

  return (
    <div className={styles.adminBoard}>
      <h1>Base de datos de Herramientas TIC</h1>
      <p>Todas las herramientas registradas hasta el momento</p>

      {/* Barra de herramientas */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.icon} />
          <input type="text" placeholder="Buscar..." />
        </div>
        <FiEdit2 className={styles.icon} />
        <FiFilter className={styles.icon} />
        <Link href='/admin/tic/new' className={styles.addButton}>Agregar</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Nombre</th>
            <th>Fecha de agregación</th>
            <th>Descripción</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => toggleRow(index)} className={styles.row}>
                <td><input type="checkbox" /></td>
                <td>{row.name}</td>
                <td>{row.date}</td>
                <td>{row.description}</td>
                <td>{row.logo}</td>
              </tr>
              {expandedRows.includes(index) && (
                <tr className={styles.expandedRow}>
                  <td colSpan={5}>
                    <div>Expandable table content</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <div className={styles.pageSize}>
          <select>
            <option value="100">100</option>
            <option value="50">50</option>
            <option value="25">25</option>
          </select>
        </div>
        <div>
          <p>1-100 of 100 items</p>
        </div>
        <div className={styles.pageControls}>
          <span>1 of 10 pages</span>
          <button className={styles.pageButton}>&lt;</button>
          <button className={styles.pageButton}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
