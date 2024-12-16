'use client';
import React, {useEffect, useState} from 'react';
import { Doughnut, Radar } from 'react-chartjs-2';  // Importa el gráfico de dona
import { Tool as PrismaTool, Category, Log } from '@prisma/client';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import styles from './DashBoard.module.css';
import { getLogs } from '@/actions/tools/get-logs';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,  // Necesario para gráficos de dona
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TooltipItem,
  RadialLinearScale, //Escencial para el radar chart
} from 'chart.js';

// Elementos de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,  // Necesario para gráficas de dona
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale, //Radar chart
);

interface ToolWithCategories extends PrismaTool {
  categories: Category[];
}

const Dashboard = () => {
  const [tools, setTools] = useState<ToolWithCategories[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const currentPage = 1;
  const itemsPerPage = -1;
  const searchQuery = '';

  useEffect(() => { 
    const fetchTools = async () => {    
      const { tools } = await getPaginatedTools({
        page: currentPage,
        take: itemsPerPage,
        search: searchQuery,
      })
      setTools(tools);
    };
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await getLogs(); // Obtener los logs desde la base de datos
        setLogs(fetchedLogs); // Almacenamos los logs en el estado
      } catch (error) {
        console.error('Error al obtener los logs:', error);
      }
    };
   
    fetchTools();
    fetchLogs();
    window.scrollTo({top: 0, behavior: "smooth"})
  }, [currentPage, itemsPerPage, searchQuery]);

  const refreshLogs = async () => {
    try {
      const fetchedLogs = await getLogs(); // Obtiene los logs actualizados
      setLogs(fetchedLogs); // Actualiza el estado de los logs
    } catch (error) {
      console.error('Error al recargar los logs:', error);
    }
  };
  useEffect(() => {
    refreshLogs();
  }, []);

  const categoryCounts = tools.reduce((acc, tool) => {
    tool.categories.forEach((category) => {
      acc[category.name] = (acc[category.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const getRandomColor = () => {    //RandomColors function
    const randomValue = () => Math.floor(Math.random() * 256);
    return `rgba(${randomValue()}, ${randomValue()}, ${randomValue()}, 0.5)`;
  }

  const categoryNames = Object.keys(categoryCounts);  
  const categoryValues = Object.values(categoryCounts);  
  const categoryColors = categoryNames.map(() => getRandomColor());
  

  const data = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryColors,
        hoverBackgroundColor: categoryColors.map(color => color.replace('0.5', '0.7')),
      },
    ],
  };


  // Opciones de configuración del gráfico
  const doughnutoptions = {
    responsive: true, // Hace que el gráfico sea responsivo
    maintainAspectRatio: false, // Permite que cambie el tamaño, sin mantener la relación de aspecto fija
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<'doughnut'>) {
            return `${tooltipItem.label}: ${tooltipItem.raw} tools`;
          },
        },
      },
    },
  };

  // Radar Chart 

  const createdLogs = logs.filter(log => log.action === 'create tool').length;
  const updatedLogs = logs.filter(log => log.action === 'update tool').length;
  const deletedLogs = logs.filter(log => log.action === 'delete tool').length;

  const radarData = {
    type: 'radar',
    labels: ['Create', 'Update', 'Delete'], // Acciones de ejemplo
    datasets: [
      {
        label: 'Tool Actions',
        data: [
          createdLogs,
          updatedLogs,
          deletedLogs,
        ], // Ejemplo de datos
        ...(() => {
          const color = getRandomColor(); // Genera un único color
          return {
            backgroundColor: color,
            borderColor: color,
            pointBackgroundColor: color,
          };
        })(),

      },
    ],
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
      },
    },
  };

  
  return (
    <div className='flex align-center space-between ph-40 column-in-mobile grid-c-3'>
      <div className={styles.adminBoard}>
        <div className={styles.donut}>
          {tools.length > 0 ? (
            <Doughnut data={data} options={doughnutoptions} />
          ) : (
            <p>{tools.length === 0 ? "No tools available" : "Loading tools..."}</p>
          )}  
          <div className={styles.donutTextContainer}>
            <p className={styles.donutText}>{tools.length}</p> 
            <p className={styles.donutTextTool}>Tools</p>
          </div>
        </div>
        <div className={styles.radar}>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;