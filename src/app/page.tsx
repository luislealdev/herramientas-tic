import { getPaginatedTools } from '@/actions/tools/get-paginated-tools';
import ToolCardUI from '@/components/UI/ToolCard';
import React from 'react';

interface Props {
  searchParams: {
    page?: string
  }
}

const HomePage: React.FC<Props> = async ({ searchParams }) => {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  // const { tools, currentPage, totalPages } = await getPaginatedTools({ page });
  const { tools } = await getPaginatedTools({ page });

  return (
    <main>
      <div className='flex align-center space-between ph-40 modal-title'>
        <h1 className='f-size-70 button'>Ticnify</h1>
        <input type="text" className='p-10 ph-20' placeholder='Buscar...' style={{ maxWidth: 300 }} />
      </div>
      <div className=''>
        <p className='center-text'>Selecciona las categorías de las herramientas </p>
        <div className='flex align-center justify-content gap-30 mt-10'>
          <button className='ph-20 p-10 no-border radius-30 bg-blue white-text bold'>Planificación</button>
          <button className='ph-20 p-10 no-border radius-30 bg-blue white-text bold'>Ejecución</button>
          <button className='ph-20 p-10 no-border radius-30 bold'>Monitoreo</button>
          <button className='ph-20 p-10 no-border radius-30 bold'>Cierre</button>
        </div>
      </div>
      <section className='grid-c-3 gap-30 p-20 mt-50'>
        {
          tools.map(tool => <ToolCardUI key={tool.slug} img={tool.images[0].url} toolName={tool.name} description={tool.description.substring(0, 150) + '...'} slug={tool.slug} />)
        }
      </section>
    </main>
  );
}

export default HomePage;