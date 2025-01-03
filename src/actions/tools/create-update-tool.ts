'use server'
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { Tool } from '@prisma/client';
import { logToolAction } from './log-tool';

// Configuración de Cloudinary para subir imágenes al folder 'herramientas-tic'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Esquema de validación para la herramienta TIC
const toolSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(3).max(255),
    description: z.string().min(3),
    categories: z.array(z.string().uuid()),
    advantages: z.array(z.string()),
    characteristics: z.array(z.string()),
    disadvantages: z.array(z.string()),
    useCases: z.array(z.string()),
    userId: z.string().uuid(),
});

// Función para crear o actualizar una herramienta TIC
export const createUpdateTool = async (formData: FormData) => {


    const data = Object.fromEntries(formData);
    data.advantages = JSON.parse(data.advantages as string);
    data.characteristics = JSON.parse(data.characteristics as string);
    data.disadvantages = JSON.parse(data.disadvantages as string);
    data.useCases = JSON.parse(data.useCases as string);
    data.categories = JSON.parse(data.categories as string);

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

            if (id) {

                tool = await prisma.tool.update({
                    where: { id },
                    data: {
                        ...rest,
                        categories: {
                            connect: rest.categories.map((id: string) => ({ id })),
                        },
                    },
                });

                await logToolAction("update", JSON.stringify(toolData), userId);
            } else {
                // Crear nueva herramienta
                tool = await prisma.tool.create({
                    data: {
                        createdBy: userId,
                        ...rest,
                        categories: {
                            connect: rest.categories.map((id: string) => ({ id })),
                        },
                    },
                });

                await logToolAction("create", JSON.stringify(toolData), userId);
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

            console.log(formData.get('logo'));


            // Save logo and update tool
            if (formData.get('logo')) {
                const logo = await uploadImages([formData.get('logo') as File]);
                if (!logo) {
                    throw new Error('No se pudo cargar el logo, rollingback');
                }

                await prisma.tool.update({
                    where: { id: tool.id },
                    data: { logo: logo[0] }
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
        // Limita las promesas en paralelo si es necesario (por ejemplo 5 a la vez)
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                // Aplica transformaciones para reducir la calidad y formato
                const response = await cloudinary.uploader.upload(
                    `data:image/jpeg;base64,${base64Image}`,  // Cambiar PNG a JPEG para mejorar la compresión
                    {
                        transformation: [
                            { quality: "auto:low", fetch_format: "auto" }, // Usa formato automático y reduce la calidad
                            { width: 800, crop: "scale" } // Redimensiona a un ancho razonable, ajustando el tamaño
                        ]
                    }
                );

                return response.secure_url;
            } catch (error) {
                console.error('Error al subir imagen:', error);
                return null;
            }
        });

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages.filter((url) => url !== null); // Filtra cualquier valor null
    } catch (error) {
        console.error('Error en la carga de imágenes:', error);
        return null;
    }
};