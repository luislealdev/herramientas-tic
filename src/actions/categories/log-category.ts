import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logCategoryAction = async (
  action: 'create' | 'update' | 'delete',
  categoryData: string,
  userId: string
) => {
  try {
    // Determina el mensaje de acción y los detalles específicos de cada acción
    let logDetails;
    let actionMessage;

    switch (action) {
      case 'create':
        actionMessage = 'create category';
        logDetails = { createdCategory: categoryData };
        break;
      case 'update':
        actionMessage = 'update category';
        logDetails = { updatedCategory: categoryData };
        break;
      case 'delete':
        actionMessage = 'delete category';
        logDetails = { deletedCategory: categoryData };
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
