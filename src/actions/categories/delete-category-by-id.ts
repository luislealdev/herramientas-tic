'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { logCategoryAction } from './log-category';

// Esquema de validación para el ID del usuario
const userIdSchema = z.string().uuid();

export const deleteCategoryById = async (id: string, userId: string) => {
  // Validar el ID del usuario
  const parsedUserId = userIdSchema.safeParse(userId);

  if (!parsedUserId.success) {
      return {
          ok: false,
          message: 'ID del usuario no válido',
      };
  }

  try {
      // Validar que la categoria exista
      const category = await prisma.category.findUnique({
          where: { id },
      });

      if (!category) {
          return {
              ok: false,
              message: 'La categoria no existe',
          };
      }

      // Eliminar la categoria de la base de datos
      const deletedCategory = await prisma.category.delete({
          where: { id },
      });

      // Registrar la acción de eliminación
      await logCategoryAction('delete', JSON.stringify(deletedCategory), userId);

      return { ok: true, message: 'Categoria eliminada exitosamente' };
  } catch {
      return {
          ok: false,
          message: 'No se pudo eliminar la categoria',
      };
  }
};
