import {deleteToolById} from "@/actions/tools/delete-tool-by-id";
import prisma from '@/lib/prisma';
import {logToolAction} from "@/actions/tools/log-tool";

jest.mock('@/lib/prisma', () => ({
    tool: {
        delete: jest.fn(),
    },
}));

jest.mock('@/actions/tools/log-tool', () => ({
    logToolAction: jest.fn(),
}));

describe('deleteToolById', () => {
    const userId = 'test-user-id';
    const toolId = 'test-tool-id';

    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar todas las simulaciones antes de cada prueba
    });

    it('should delete tool successfully and log the action when the tool is found', async () => {
        const mockTool = {
            id: toolId,
            name: 'Test Tool',
            createdBy: userId,
            // Añadir otros campos relevantes del modelo Tool si es necesario
        };

        // Simulaciones del método delete de Prisma y logToolAction
        (prisma.tool.delete as jest.Mock).mockResolvedValueOnce(mockTool);
        (logToolAction as jest.Mock).mockResolvedValueOnce(undefined);

        const result = await deleteToolById(toolId, userId);

        // Verificaciones y Expectativas
        expect(result).toEqual({ ok: true });
        expect(prisma.tool.delete).toHaveBeenCalledWith({ where: { id: toolId } });
        expect(logToolAction).toHaveBeenCalledWith('delete', JSON.stringify(mockTool), userId);
    });

    it('should return an error when the tool deletion fails', async () => {
        const errorMessage = 'No se pudo eliminar la herramienta';

        // Simulación de un error en la eliminación de la herramienta
        (prisma.tool.delete as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));

        const result = await deleteToolById(toolId, userId);

        // Verificaciones y Expectativas
        expect(result).toEqual({ ok: false, message: errorMessage });
        expect(prisma.tool.delete).toHaveBeenCalledWith({ where: { id: toolId } });
        expect(logToolAction).not.toHaveBeenCalled();
    });
});