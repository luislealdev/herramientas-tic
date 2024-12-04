'use server'
import prisma from '@/lib/prisma';

export const getLogs = async (search: string = '') => {
    const where: {
        OR?: { action?: { contains: string, mode: 'insensitive' }, details?: { path: string[], string_contains: string, mode: 'insensitive' } }[]
    } = {};

    if (search) {
        where.OR = [
            { action: { contains: search, mode: 'insensitive' } },
            { details: { path: ['description'], string_contains: search, mode: 'insensitive' } },
        ];
    }

    try {
        const logs = await prisma.log.findMany({
            orderBy: {
                realizedAt: 'desc'
            },
            where,
        });
        return logs;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch logs');
    }
}