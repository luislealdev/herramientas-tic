"use client";
import React, { useState, useEffect } from 'react';
import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import ToolCardUI from '@/components/UI/ToolCard';
import Loader from '@/components/UI/Loader';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      try {
        const { tools, totalPages } = await getPaginatedTools({
          page,
          search,
          category: selectedCategories.join(','),
        });
        setTools(tools);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }}
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
          className="p-10 ph-20"
          placeholder="Buscar..."
          style={{ maxWidth: 300 }}
          value={search}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
        />
      </div>
      <div>
        <p className="center-text">Selecciona las categorías de las herramientas</p>
        <div className="flex align-center justify-content gap-30 mt-10 grid-c-2-in-mobile">
          {['Planificación', 'Ejecución', 'Monitoreo', 'Cierre'].map((cat) => (
            <button
              key={cat}
              className={`ph-20 p-10 no-border radius-30 ${
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
        {isLoading ? (
          <Loader />
        ) : tools.length > 0 ? (
          tools.map((tool) => (
            <ToolCardUI
              key={tool.slug}
              img={tool.logo ? tool.logo : tool.images[0]?.url || ''}
              toolName={tool.name}
              description={tool.description.substring(0, 150) + '...'}
              slug={tool.slug}
            />
          ))
        ) : (
          <p className="center-h">No se encontraron herramientas</p>
        )}
      </section>
      <div className="flex justify-content align-center mt-20">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="ph-20 p-10 no-border radius-30 bold bg-light-gray"
        >
          Anterior
        </button>
        <span className="ph-20">Página {page} de {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="ph-20 p-10 no-border radius-30 bold bg-light-gray"
        >
          Siguiente
        </button>
      </div>
    </main>
  );
};

export default HomePage;
