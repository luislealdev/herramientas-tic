'use server'
import prisma from '@/lib/prisma';

export const deleteToolById = async (id: string) => {
    try {

        await prisma.tool.delete({
            where: {
                id: id
            }
        })

        return { ok: true };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la herramienta'
        }

    }

}