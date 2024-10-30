'use server'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { Tool } from '@prisma/client';

// Configuración de Cloudinary para subir imágenes al folder 'herramientas-tic'
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

// Esquema de validación para la herramienta TIC
const toolSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(3).max(255),
    description: z.string().min(3),
    categories: z.string(),
    advantages: z.string(),
    disadvantages: z.string(),
    useCases: z.string(),
    userId: z.string().uuid(),
});

// Función para crear o actualizar una herramienta TIC
export const createUpdateTool = async (formData: FormData) => {


    const data = Object.fromEntries(formData);
    const parsedData = toolSchema.safeParse(data);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return {
            ok: false,
            message: 'Error en la validación de datos',
        };
    }


    const { userId, ...toolData } = parsedData.data;


    if (!toolData.categories || toolData.categories.length === 0) {
        return {
            ok: false,
            message: 'Debe seleccionar al menos una categoría',
        };
    }

    const toolToUpload = {
        ...toolData,
        slug: toolData.name.toLowerCase().replace(/ /g, '-').trim(),
    };
    const { id, ...rest } = toolToUpload;

    try {
        const prismaTx = await prisma.$transaction(async () => {
            let tool: Tool;
            const categories = rest.categories.split(',').map((id: string) => id);
            const advantages = rest.advantages.split(',');
            const disadvantages = rest.disadvantages.split(',');
            const useCases = rest.useCases.split(',');


            if (id) {

                tool = await prisma.tool.update({
                    where: { id },
                    data: {
                        ...rest,
                        // logo: logo[0] ?? '', // Actualiza el logo si se sube uno nuevo
                        categories: {
                            connect: categories.map((id: string) => ({ id })),
                        },
                        advantages: {
                            set: advantages,
                        },
                        disadvantages: {
                            set: disadvantages,
                        },
                        useCases: {
                            set: useCases,
                        },
                    },
                });
            } else {
                // Crear nueva herramienta
                tool = await prisma.tool.create({
                    data: {
                        createdBy: userId,
                        ...rest,
                        // logo: logo[0] ?? '',
                        categories: {
                            connect: categories.map((id: string) => ({ id })),
                        },
                        advantages: {
                            set: advantages,
                        },
                        disadvantages: {
                            set: disadvantages,
                        },
                        useCases: {
                            set: useCases,
                        },
                    },
                });
            }

            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[]);
                if (!images) {
                    throw new Error('No se pudo cargar las imágenes, rollingback');
                }

                await prisma.image.createMany({
                    data: images.map(image => ({
                        url: image!,
                        toolId: tool.id,
                    }))
                });

            }


            return { tool };
        });

        revalidatePath('/herramienta');
        revalidatePath(`/herramienta/${rest.slug}`);

        return { ok: true, tool: prismaTx.tool };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al crear o actualizar la herramienta TIC',
        };
    }
};


// Función para subir imágenes a Cloudinary
const uploadImages = async (images: File[]) => {

    try {

        const uploadPromises = images.map(async (image) => {

            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url);

            } catch (error) {
                console.log(error);
                return null;
            }
        })


        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {

        console.log(error);
        return null;

    }


}