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
    categories: z.array(z.string().uuid()),
    advantages: z.array(z.string().min(3).max(255)),
    disadvantages: z.array(z.string().min(3).max(255)),
    useCases: z.array(z.string().min(3).max(255)),
});

// Función para crear o actualizar una herramienta TIC
export const createUpdateTool = async (formData: FormData) => {

    // Get createdBy if from session
    // const user = session.get('user');
    // const createdBy = user?.id;

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
    }
    const { id, ...rest } = toolToUpload;

    try {
        const prismaTx = await prisma.$transaction(async () => {
            let tool: Tool;
            const categories = rest.categories.map((id: string) => id);
            const advantages = rest.advantages.map((text: string) => text);
            const disadvantages = rest.disadvantages.map((text: string) => text);
            const useCases = rest.useCases.map((text: string) => text);

            if (id) {
                // Actualizar herramienta existente
                tool = await prisma.tool.update({
                    where: { id },
                    data: {
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
                tool = await prisma.tool.create({
                    data: {
                        // TODO: CHANGE createdBy to the user id
                        createdBy: '',
                        logo: '',
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


            // Cargar el logo si está presente
            // Proceso de carga y guardado de logo
            if (formData.get('logo')) {
                const logo = await uploadImages([formData.get('logo') as File]);
                if (!logo) {
                    throw new Error('No se pudo cargar el logo, rollingback');
                }

                await prisma.tool.update({
                    where: { id: toolData.id! },
                    data: {
                        logo: logo[0]!,
                    },
                });
            }

            // Cargar las imágenes si están presentes
            // Proceso de carga y guardado de imagenes
            if (formData.getAll('images')) {
                // [https://url.jpg, https://url.jpg]
                const images = await uploadImages(formData.getAll('images') as File[]);
                if (!images) {
                    throw new Error('No se pudo cargar las imágenes, rollingback');
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