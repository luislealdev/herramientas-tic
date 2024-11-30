'use client';
import React, { useEffect, useState } from 'react';
import { FiArchive, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { getPaginatedCategories } from '@/actions/categories/get-paginated-categories';
import styles from '../AdminBoard.module.css';
import { Category } from '@prisma/client';

export const CategoriesTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRow = (index: number) => {
    if (expandedCategories.includes(index)) {
      setExpandedCategories(expandedCategories.filter((i) => i !== index));
    } else {
      setExpandedCategories([...expandedCategories, index]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { categories, totalPages } = await getPaginatedCategories({
        page: currentPage,
        take: itemsPerPage,
        search: searchQuery,
      });
      setCategories(categories);
      setTotalPages(totalPages);
    };

    fetchCategories();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
      <h1>Base de datos de las Categorías TIC</h1>
      <p>Todas las categorías registradas hasta el momento</p>

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
        <Link href="/admin/category/new" className={styles.addButton}>
          Agregar
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Número de Herramientas</th>
          </tr>
        </thead>
        <tbody>
        {categories.map((tool, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => toggleRow(index)} className={styles.tool}>
                <td>{tool.name}</td>
              </tr>

              {expandedCategories.includes(index) && (
                <tr className={styles.setExpandedTools}>
                  <td>
                    <div className="flex justify-content" style={{ gap: '16px', paddingTop: 10 }}>
                      <Link href={`/admin/category/${tool.name}`} className={styles.addButton}> Editar </Link>
                      <button className={styles.deleteButton}> Eliminar </button>
                    </div>
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
