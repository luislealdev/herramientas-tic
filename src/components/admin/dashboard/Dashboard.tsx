'use client';
import React, {useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';  // Importa el gráfico de dona
import { Tool as PrismaTool, Category } from '@prisma/client';
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
  LineElement,
  TooltipItem
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

interface ToolWithCategories extends PrismaTool {
  categories: Category[];
}

const Dashboard = () => {
  const [tools, setTools] = useState<ToolWithCategories[]>([]);
  const currentPage = 1;
  const itemsPerPage = 10;
  const searchQuery = '';

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
  const options = {
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
  
  return (
    <div>
      
      <div className={styles.donut}>
        {tools.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <p>{tools.length === 0 ? "No tools available" : "Loading tools..."}</p>
        )}  
        <div className={styles.donutTextContainer}>
          <p className={styles.donutText}>{tools.length}</p> 
          <p className={styles.donutTextTool}>Tools</p>
        </div>
    </div>

    </div>
  );
};

export default Dashboard;