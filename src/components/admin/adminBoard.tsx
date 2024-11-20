'use client';
import React, { useEffect, useState } from 'react';
import styles from './AdminBoard.module.css';
import { FiArchive, FiCheckSquare, FiFilter, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import { Tool } from '@prisma/client';
import Image from 'next/image';
import { auth } from '@/auth.config';


const AdminBoard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [expandedTools, setExpandedTools] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    if (expandedTools.includes(index)) {
      setExpandedTools(expandedTools.filter((i) => i !== index));
    } else {
      setExpandedTools([...expandedTools, index]);
    }
  };

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
        <FiFilter className={styles.icon} />
        <FiArchive className={styles.icon} />        
        <Link href='/admin/tic/new' className={styles.addButton}>Agregar</Link>
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
                <td><Image src={tool.logo} width={150} height={100} alt={tool.name}/></td>
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
                        
                        <div className= "flex justify-content" style={{ gap: '16px', paddingTop:10 }}> 
                          <Link href={`/admin/tic/${tool.name}`} className={styles.addButton}> Editar </Link>
                          <button className={styles.deleteButton}> Eliminar </button>
                        </div> 
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