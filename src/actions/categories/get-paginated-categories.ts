'use server'
import prisma from '@/lib/prisma';

interface PaginationOptions {
    page?: number,
    take?: number,
    search?: string
}

export const getPaginatedCategories = async ({ page = 1, take = 9, search = '' }: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  const where: {
      OR?: { name?: { contains: string, mode: 'insensitive' }}[]
  } = {};

  if (search) {
      where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
      ];
  } 

  try {
      const categories = await prisma.category.findMany({
          where, 
          take,
          skip: (page - 1) * take,
          orderBy: {
              name: 'asc',
          },
      });

      const totalCount = await prisma.category.count({ where }); 
      const totalPages = Math.ceil(totalCount / take);

      return {
          currentPage: page,
          totalPages,
          categories,
      };
  } catch (error) {
      console.error(error);
      throw new Error("No se pudieron cargar las herramientas");
  }
};