import { getCategories, getToolBySlug } from '@/actions';
import { EditTICForm } from '@/components/admin';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        slug: string;
    }
}


const EditTIC = async ({ params }: Props) => {

    const { slug } = params;
    const [tool, categories] = await Promise.all([
        getToolBySlug(slug),
        getCategories()
    ]);

    // Todo: new
    if (!tool && slug !== 'new') {
        redirect('/admin/tic/')
    }

    const title = (slug === 'new') ? 'Agregar' : 'Editar'

    return (
        <main className='p-100'>
            <h1>{title} herramienta TIC</h1>
            <EditTICForm tool={tool ?? {}} categories={categories} />
        </main>
    )
}

export default EditTIC;