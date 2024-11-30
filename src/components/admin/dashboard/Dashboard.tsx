import React, {useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';  // Importa el gráfico de dona
import { Tool } from '@prisma/client';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import styles from './DashBoard.module.css';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,  // Necesario para gráficos de dona
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
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
  LineElement
);

const Dashboard = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery] = useState('');

  useEffect(() => { 
      const fetchTools = async () => {
      const { tools } = await getPaginatedTools({
          page: currentPage,
          take: itemsPerPage,
          search: searchQuery,
      });
      setTools(tools);
      };

      fetchTools();
      window.scrollTo({top: 0, behavior: "smooth"})
  }, [currentPage, itemsPerPage, searchQuery]);

  // Datos del gráfico
  const data = {
    labels: ['Planificacion', 'Montoreo', 'Ejecucion', 'Cierre'],  // Etiquetas de cada sección
    datasets: [
      {
        data: [150, 50, 100, 80],  // Valores de cada sección de la dona
        backgroundColor: ['#FF5733', '#33B5FF', '#FFEB3B', '#008000'],  // Colores de las secciones
        hoverBackgroundColor: ['#FF0000', '#C100FF', '#FFFF00', '#006400'],  // Colores al pasar el ratón
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true, // Hace que el gráfico sea responsivo
    maintainAspectRatio: false, // Permite que cambie el tamaño, sin mantener la relación de aspecto fija
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw} tools`;
          },
        },
      },
    },
  };
  
  return (
    <div>
      
      <div className={styles.donut}>
        <Doughnut data={data} options={options} />
        <div className={styles.donutText}>
          {tools.length} Tools
        </div>
    </div>

    </div>
  );
};

export default Dashboard;
