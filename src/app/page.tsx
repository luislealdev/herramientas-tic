"use client";
import React, { useState, useEffect } from 'react';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import ToolCardUI from '@/components/UI/ToolCard';

interface Props {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
  };
}

interface Tool {
  id: string;
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  slug: string;
  images: { id: string; url: string; toolId: string }[];
  logo: string;
}

const HomePage: React.FC<Props> = ({ searchParams }) => {
  const [page, setPage] = useState(searchParams.page ? parseInt(searchParams.page) : 1);
  const [search, setSearch] = useState(searchParams.search || '');
  const [tools, setTools] = useState<Tool[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      const { tools, totalPages } = await getPaginatedTools({
        page,
        search,
        category: selectedCategories.join(','),
      });
      setTools(tools);
      setTotalPages(totalPages);
    };

    fetchTools();
    // Volver al inicio cuando cambia de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, search, selectedCategories]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setPage(1); // Reset to first page on new search
      }, 2000)
    );
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      setPage(1); // Reset to first page on new search
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <main>
      <div className="flex align-center space-between ph-40 column-in-mobile">
  <h1 className="f-size-70 button">Ticnify</h1>
  <input
    type="text"
    style={{
      maxWidth: '300px',
      transition: 'all 0.3s ease-in-out',
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      outline: 'none',
    }}
    placeholder="Buscar..."
    value={search}
    onChange={handleSearchChange}
    onKeyPress={handleSearchKeyPress}
    /*
    Animación para la barra de busqueda con js
    onFocus={(e) => {
      e.target.style.maxWidth = '400px';
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.border = '1px solid #007BFF';
      e.target.style.boxShadow = '0 4px 10px rgba(0, 123, 255, 0.3)';
    }}
    onBlur={(e) => {
      e.target.style.maxWidth = '300px';
      e.target.style.backgroundColor = '#f9f9f9';
      e.target.style.border = '1px solid #ccc';
      e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }} */      
  />
    </div>
      <div>
        <p className="center-text">Selecciona las categorías de las herramientas</p>
        <div className="flex align-center justify-content gap-30 mt-10 grid-c-2-in-mobile">
          {['Planificación', 'Ejecución', 'Monitoreo', 'Cierre'].map((cat) => (
            <button
              key={cat}
              className={`ph-20 p-10 no-border radius-30 shadow grow ${
                selectedCategories.includes(cat) ? 'bg-blue white-text bold' : 'bold'
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <section className="grid-c-3 gap-30 p-20 mt-50" style={{minHeight: "30vh"}}>
        {tools.map((tool) => (
          <ToolCardUI
            key={tool.slug}
            img={tool.logo ? tool.logo : tool.images[0]?.url || ''}
            toolName={tool.name}
            description={tool.description.substring(0, 150) + '...'}
            slug={tool.slug}
          />
        ))}
      </section>
      <div className="flex justify-content align-center mt-20">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="ph-20 p-10 no-border radius-30 bold glass-morphism grow"
        >
          Anterior
        </button>
        <span className="ph-20">Página {page} de {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="ph-20 p-10 no-border radius-30 bold glass-morphism grow"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
};

export default HomePage;
