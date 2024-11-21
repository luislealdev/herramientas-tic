'use client';
import React, { useEffect, useState } from 'react';
import styles from './AdminBoard.module.css';
import { FiArchive, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import { Tool } from '@prisma/client';
import Image from 'next/image';

const AdminBoard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [expandedTools, setExpandedTools] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRow = (index: number) => {
    if (expandedTools.includes(index)) {
      setExpandedTools(expandedTools.filter((i) => i !== index));
    } else {
      setExpandedTools([...expandedTools, index]);
    }
  };

  const fetchTools = async () => {
    const { tools, totalPages } = await getPaginatedTools({
      page: currentPage,
      take: itemsPerPage,
      search: searchQuery,
    });
    setTools(tools);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchTools();
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.adminBoard}>
      <h1>Base de datos de Herramientas TIC</h1>
      <p>Todas las herramientas registradas hasta el momento</p>

      {/* Barra de herramientas */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.icon} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <FiFilter className={styles.icon} />
        <FiArchive className={styles.icon} />
        <Link href="/admin/tic/new" className={styles.addButton}>
          Agregar
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Logo</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => toggleRow(index)} className={styles.tool}>
                <td>{tool.name}</td>
                <td>{tool.description}</td>
                <td>
                  <Image src={tool.logo} width={150} height={100} alt={tool.name} />
                </td>
              </tr>
              {expandedTools.includes(index) && (
                <tr className={styles.setExpandedTools}>
                  <td colSpan={3}>
                    {/* Información expandida */}
                    <strong>Ventajas:</strong>
                    <ul>
                      {tool.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                    <Link href={`/admin/tic/${tool.name}`} className={styles.addButton}>
                      Editar
                    </Link>
                    <button className={styles.deleteButton}>Eliminar</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className={styles.pagination}>
        <div className={styles.pageSize}>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="50">50</option>
            <option value="25">25</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className={styles.pagesInfo}>
          <p>
            Página {currentPage} de {totalPages}
          </p>
        </div>
        <div className={styles.pageControls}>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;
