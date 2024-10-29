'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { Category } from '@prisma/client';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Esquema de validación para la categoría
const categorySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(3).max(255),
});

// Función para crear o actualizar una categoría
export const createUpdateCategory = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const parsedCategory = categorySchema.safeParse(data);

  if (!parsedCategory.success) {
    console.log(parsedCategory.error);
    return {
      ok: false,
      message: 'Error en la validación de datos',
    };
  }

  const categoryData = parsedCategory.data;
  const categoryToUpload = {
    ...categoryData,
    slug: categoryData.name.toLowerCase().replace(/ /g, '-').trim(),
  };
  const { id, ...rest } = categoryToUpload;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let category: Category;
      
      if (id) {
        // Actualizar categoría existente
        category = await prisma.category.update({
          where: { id },
          data: rest,
        });
      } else {
        // Crear nueva categoría
        category = await prisma.category.create({
          data: {
            ...rest,
            //createdBy: '36488659-0d0b-4124-aa20-58b8c4a0f26a',  // Placeholder para el usuario creador
          },
        });
      }

      return { category };
    });

    revalidatePath('/categories');
    revalidatePath(`/categories/${rest.slug}`);

    return { ok: true, category: prismaTx.category };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error al crear o actualizar la categoría',
    };
  }
};
  