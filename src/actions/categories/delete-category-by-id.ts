'use server';
import prisma from '@/lib/prisma';
import { logCategoryAction } from './log-category';

export const deleteCategoryById = async (id: string, userId: string) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id: id,
      },
    });

    await logCategoryAction('delete', JSON.stringify(deletedCategory), userId);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la categoría.',
    };
  }
};
