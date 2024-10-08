'use server'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { Tool } from '@prisma/client';

// Configuración de Cloudinary para subir imágenes al folder 'herramientas-tic'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// Esquema de validación para la herramienta TIC
const toolSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    categories: z.string(),
    advantages: z.string(),
    disadvantages: z.string(),
    useCases: z.string(),
});

// Función para crear o actualizar una herramienta TIC
export const createUpdateTool = async (formData: FormData) => {
    console.log('formData', formData);

    const data = Object.fromEntries(formData);
    const parsedTool = toolSchema.safeParse(data);

    if (!parsedTool.success) {
        console.log(parsedTool.error);
        return {
            ok: false,
            message: 'Error en la validación de datos',
        };
    }

    const toolData = parsedTool.data;

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

            let logo = null; // Variable para almacenar el logo

            if (id) {
                // Actualizar herramienta existente
                if (formData.get('logo')) {
                    logo = await uploadImages([formData.get('logo') as File]);
                }

                tool = await prisma.tool.update({
                    where: { id },
                    data: {
                        logo: logo ? logo[0] || undefined : undefined, // Actualiza el logo si se sube uno nuevo
                        ...rest,
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
                logo = (await uploadImages([formData.get('logo') as File]))?.[0] || '';
                tool = await prisma.tool.create({
                    data: {
                        createdBy: '36488659-0d0b-4124-aa20-58b8c4a0f26a',
                        logo, // Guardar logo al crear
                        ...rest,
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

            // Cargar las imágenes si están presentes
            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[]);
                if (!images) {
                    throw new Error('No se pudo cargar las imágenes, rolling back');
                }

                await prisma.image.createMany({
                    data: images.map(image => ({
                        url: image!,
                        toolId: toolData.id!,
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