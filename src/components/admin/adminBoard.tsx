'use client';
import React, { useEffect, useState } from 'react';
import styles from './AdminBoard.module.css';
import { FiEdit, FiEdit2, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import { Tool } from '@prisma/client';
import Image from 'next/image';
// import { FiSearch, FiEdit2, FiFilter } from 'react-icons/fi'; // Para los iconos

const AdminBoard = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      const { tools } = await getPaginatedTools({ page: 1 });
      setTools(tools);
    };

    fetchTools();
  }, []);


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
        <FiEdit className={styles.icon}/>
        <FiEdit2 className={styles.icon} />
        <FiFilter className={styles.icon} />
        <Link href='/admin/tic/new' className={styles.addButton}>Agregar</Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, index) => (
            <React.Fragment key={index}>
              <tr className={styles.row}>
              {/* <tr onClick={() => toggleRow(index)} className={styles.row}> */}
                <td><input type="checkbox" /></td>
                <td>{tool.name}</td>
                <td>{tool.description}</td>
                <td><Image src={tool.logo} width={50} height={50} alt={tool.name}/></td>
              </tr>
              {/* {expandedRows.includes(index) && (
                <tr className={styles.expandedRow}>
                  <td colSpan={5}>
                    <div>Expandable table content</div>
                  </td>
                </tr>
              )} */}
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