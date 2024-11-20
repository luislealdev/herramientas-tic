'use server'
import prisma from '@/lib/prisma';

interface PaginationOptions {
    page?: number,
    take?: number,
    search?: string,
    category?: string,
}

export const getPaginatedTools = async ({ page = 1, take = 9, search = '', category = '' }: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const where: {
        OR?: { name?: { contains: string, mode: 'insensitive' }, description?: { contains: string, mode: 'insensitive' } }[],
        categories?: { some: { name: { in: string[] } } }
    } = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    } else if (category) {
        where.categories = { some: { name: { in: category.split(',') } } };
    }

    try {
        const tools = await prisma.tool.findMany({
            take: take,
            skip: (page - 1) * take,
            orderBy: {
                name: 'asc'
            },
            where,
            include: {
                images: true
            }
        });
        const totalCount = await prisma.tool.count({ where });
        const totalPages = Math.ceil(totalCount / take);
        return {
            currentPage: page,
            totalPages,
            tools
        }
    } catch (error) {
        console.error(error);
        throw new Error("No se pudieron cargar las herramientas")
    }
}