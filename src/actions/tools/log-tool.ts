import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const logToolAction = async (
  action: 'create' | 'update' | 'delete',
  toolData: string,
  userId: string
) => {
  try {
    // Determina el mensaje de acción y los detalles específicos de cada acción
    let logDetails;
    let actionMessage;

    switch (action) {
      case 'create':
        actionMessage = 'create tool';
        logDetails = { createdTool: toolData };
        break;
      case 'update':
        actionMessage = 'update tool';
        logDetails = { updatedTool: toolData };
        break;
      case 'delete':
        actionMessage = 'delete tool';
        logDetails = { deletedTool: toolData };
        break;
      default:
        throw new Error('Action not recognized');
    }

    // Crea el log en la base de datos
    await prisma.log.create({
      data: {
        action: actionMessage,
        madeBy: userId,
        details: logDetails,
      },
    });

    console.log(`Log created for ${actionMessage}`);
  } catch (error) {
    console.error('Error creating log:', error);
  }
};