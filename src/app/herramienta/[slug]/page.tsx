import { getToolBySlug } from '@/actions';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
    params: {
        slug: string
    }
}

export async function generateMetadata(
    { params }: Props,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = params.slug;
    // fetch data
    const tool = await getToolBySlug(slug);
    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []
    return {
        title: tool?.name ?? "Herramienta no encontrada",
        description: tool?.description ?? "",
        openGraph: {
            title: tool?.name ?? "Herramienta no encontrada",
            description: tool?.description ?? "",
            images: [`${tool?.images[1]}`],
        },
    };
}

const ToolPage = async ({ params }: Props) => {

    const { slug } = params;
    const tool = await getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    return (
        <main>
            <section className='grid-c-2 p-100'>
                <Image className='max-width p-40' alt={tool.name} src={tool.images[0]} width={1000} height={1000} />
                <div>
                    <h1>{tool.name}</h1>
                    <p className='f-size-16 justify-text'>{tool.description}</p>
                    <h2 className='mt-10'>Casos de uso</h2>
                    <div className='flex gap-30'>
                        {
                            tool.useCases.map(useCase => <p className='bg-gray-m center-text p-5 f-size-14' key={useCase}>{useCase}</p>)
                        }
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ToolPage