'use client';

import { useForm } from "react-hook-form";
import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { Category } from "@prisma/client";
import { useRouter } from 'next/navigation';
import { createUpdateCategory } from "@/actions";

interface Props {
  category: Partial<Category>;
}

interface FormInputs {
  name: string;
}

  export const EditCategoryForm = ({ category }: Props) => {
  const router = useRouter();
  
  const { handleSubmit, register, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      name: category.name || '',
    },
  });

  const onSubmit = async (data: FormInputs) => {
    if (!data.name) {
      alert("Debe de tener un nombre la categoría");
      return;
    }

    const formData = new FormData();
    if (category.id) {
      formData.append("id", category.id ?? "");
    }
    formData.append("name", data.name);

    const response = await createUpdateCategory(formData); 

    if (response && response.ok) {
      const updatedCategory = response.category;
      router.replace(`/admin/category/${updatedCategory?.slug}`);
    } else {
      alert('La categoría no se pudo actualizar');
      console.error('Error al actualizar la categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex column mt-20">
      <label htmlFor="name">Nombre de la Categoría</label>
      <input 
        {...register("name", { required: "El nombre es obligatorio" })}
        type="text"
        className="mt-10"
        placeholder="Ingrese el nombre de la categoría"
      />
      {errors.name && <p className="error">{errors.name.message}</p>}
      
      <Button type="submit" renderIcon={Add}>
        Guardar
      </Button>
    </form>
  );
};
