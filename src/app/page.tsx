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
      <section className='flex space-between p-50 modal-title'>
        <h1 className='f-size-30 button'>Ticnify </h1>
        <input type="text" className='p-5 ph-20 shadow login-input' />
      </section>
      <p className='center-text'>Selecciona las categorías de las herramientas </p>
      <section className='grid-c-3 gap-30 p-20'>
        {
          tools.map(tool => <ToolCardUI key={tool.slug} img={tool.images[0].url} toolName={tool.name} description={tool.description} />)
        }
      </section>
    </main>
  );
}

export default HomePage;