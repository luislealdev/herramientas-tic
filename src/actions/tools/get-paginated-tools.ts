'use server'
import prisma from '@/lib/prisma';

interface  PaginationOptions{
    page?: number,
    take?: number,
}
export const getPaginatedTools = async ({ page = 1, take = 7 }: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const tools = await prisma.tool.findMany({
            take: take,
            skip: (page - 1) * take,
        });

        const totalCount = await prisma.tool.count({});
        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages,
            tools
        }
    } catch (error) {
        throw new Error("No se pudieron cargar las herramientas")
    }
}