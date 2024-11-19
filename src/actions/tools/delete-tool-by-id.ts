'use server'
import prisma from '@/lib/prisma';
import { logToolAction } from './log-tool';

export const deleteToolById = async (id: string, userId: string) => {
    try {

        const deletedTool = await prisma.tool.delete({
            where: {
                id: id
            }
        })

        await logToolAction('delete', JSON.stringify(deletedTool), userId);
        return { ok: true };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo eliminar la herramienta'
        }

    }

}