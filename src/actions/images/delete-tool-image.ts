'use server';

import prisma from "@/lib/prisma";

export const deleteToolImage = async (id: string) => {
    try {
        await prisma.image.delete({
            where: {
                id
            },
        })
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: 'Error al eliminar imagen',
        };
    }
}; 