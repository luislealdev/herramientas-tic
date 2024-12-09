'use client';
import React, { useEffect, useState } from 'react';
import { FiArchive, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { Tool } from '@prisma/client';
import Image from 'next/image';
import { deleteToolById } from '@/actions/tools/delete-tool-by-id'
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import styles from '../AdminBoard.module.css';


export const ToolsTable = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [expandedTools, setExpandedTools] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteTool = async (toolId: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta herramienta?');
    if (confirmDelete) {
      const userId = '12345'; // Reemplázalo con la lógica para obtener el ID del usuario actual.
      const result = await deleteToolById(toolId, userId);

      if (result.ok) {
        setTools(tools.filter((tool) => tool.id !== toolId));
        alert('Herramienta eliminada correctamente.');
      } else {
        alert(result.message || 'Error al eliminar la herramienta.');
      }
    }
  };

  const toggleRow = (index: number) => {
    if (expandedTools.includes(index)) {
      setExpandedTools(expandedTools.filter((i) => i !== index));
    } else {
      setExpandedTools([...expandedTools, index]);
    }
  };

  useEffect(() => {
    const fetchTools = async () => {
      const { tools, totalPages } = await getPaginatedTools({
        page: currentPage,
        take: itemsPerPage,
        search: searchQuery,
      });
      setTools(tools);
      setTotalPages(totalPages);
    };

    fetchTools();
    // Volver al inicio cuando cambia de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className='flex align-center space-between ph-40 column-in-mobile'>
      <div className={styles.adminBoard}>


      {/* Barra de herramientas */}
      <div className={styles.toolbar }>
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
                <td><Image src={tool.logo} width={150} height={100} alt={tool.name} layout="responsive" /></td>
              </tr>

              {expandedTools.includes(index) && (
                <tr className={styles.setExpandedTools}>
                  <td colSpan={4}>
                    <td>
                      <strong className={styles.header}> Ventajas </strong>
                      {tool.advantages && (
                        <ul className={styles.list}>
                          {tool.advantages.map((advantage, index) => (
                            <li key={index}>{advantage}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      <strong className={styles.header}> Desventajas </strong>
                      {tool.disadvantages && (
                        <ul className={styles.list}>
                          {tool.disadvantages.map((disadvantage, index) => (
                            <li key={index}>{disadvantage}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      <strong className={styles.header}> Características </strong>
                      {tool.characteristics && (
                        <ul className={styles.list}>
                          {tool.characteristics.map((characteristics, index) => (
                            <li key={index}>{characteristics}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      <strong className={styles.header}> Casos de uso </strong>
                      {tool.useCases && (
                        <ul className={styles.list}>
                          {tool.useCases.map((useCases, index) => (
                            <li key={index}>{useCases}</li>
                          ))}
                        </ul>
                      )}
                    </td>

                    <div className="flex justify-content" style={{ gap: '16px', paddingTop: 10 }}>
                      <Link href={`/admin/tic/${tool.slug}`} className={styles.addButton}> Editar </Link>
                      <button className={styles.deleteButton} onClick={() => handleDeleteTool(tool.id)}> Eliminar </button>
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
    </div>
  );
};
