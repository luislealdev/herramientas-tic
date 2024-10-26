import { EditCategoryForm } from "@/components/admin/EditCategoryForm";
import { redirect } from 'next/navigation';
import { getCategories } from "@/actions";

interface Props {
  params: {
    slug: string;
  }
}


const EditCategory = async ({ params }:Props) => {
  
const { slug } = params;
const categories = await getCategories();
const category = categories.find(category => category.slug == slug ) || {slug: '', id: '', name:'' };

  if (!category && slug !== 'category') {
    redirect('/admin/tic/')
}
  const title = (slug === 'new') ? 'Agregar' : 'Editar'


  return (
    <main className='p-100'>
    <h1>{title} Categoría</h1>
    <EditCategoryForm category={category}/>
    </main>
  )
}

export default EditCategory;