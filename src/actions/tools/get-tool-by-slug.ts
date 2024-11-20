'use server';

import prisma from '@/lib/prisma';

export const getToolBySlug = async (slug: string) => {
    try {

        const tool = await prisma.tool.findFirst({
            include: {
                images: true,
                categories: true
            },
            where: {
                slug: {
                    equals: slug,
                    mode: 'insensitive', 
                },
            }
        })


        if (!tool) return null;

        return {
            ...tool,
        };


    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener herramienta por slug');
    }



}