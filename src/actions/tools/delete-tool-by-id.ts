'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { logToolAction } from './log-tool';

// Esquema de validación para el ID del usuario
const userIdSchema = z.string().uuid();

export const deleteToolById = async (id: string, userId: string) => {
    // Validar el ID del usuario
    const parsedUserId = userIdSchema.safeParse(userId);

    if (!parsedUserId.success) {
        return {
            ok: false,
            message: 'ID del usuario no válido',
        };
    }

    try {
        // Validar que la herramienta exista
        const tool = await prisma.tool.findUnique({
            where: { id },
        });

        if (!tool) {
            return {
                ok: false,
                message: 'La herramienta no existe',
            };
        }

        // Validar que el usuario sea el creador de la herramienta
        if (tool.createdBy !== userId) {
            return {
                ok: false,
                message: 'No tienes permisos para eliminar esta herramienta',
            };
        }

        // Eliminar la herramienta de la base de datos
        const deletedTool = await prisma.tool.delete({
            where: { id },
        });

        // Registrar la acción de eliminación
        await logToolAction('delete', JSON.stringify(deletedTool), userId);

        return { ok: true, message: 'Herramienta eliminada exitosamente' };
    } catch {
        return {
            ok: false,
            message: 'No se pudo eliminar la herramienta',
        };
    }
};