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
                slug: slug,
            }
        })


        if (!tool) return null;

        return {
            ...tool,
            images: tool.images.map(image => image.url)
        };


    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener herramienta por slug');
    }



}