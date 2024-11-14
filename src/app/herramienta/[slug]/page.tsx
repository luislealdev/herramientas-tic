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
            images: [`${tool?.images[0]}`],
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
                <Image className='max-width p-40' alt={tool.name} src={tool.logo ? tool.logo : tool.images[0]} width={1000} height={1000} />
                <div>
                    <h1>{tool.name}</h1>
                    <p className='f-size-16 justify-text'>{tool.description}</p>
                    <h2 className='mt-20'>Casos de uso</h2>
                    <div className='flex flex-wrap gap-30'>
                        {
                            tool.useCases.map(useCase => <p className='bg-gray-m center-text p-5 f-size-14' key={useCase}>{useCase}</p>)
                        }
                    </div>
                    <h2 className='mt-20'>Características</h2>
                    <div className='flex flex-wrap gap-5 mt-10'>
                        {
                            tool.characteristics.map(c => <p className='bg-gray-m center-text p-5 f-size-14' key={c}>{c}</p>)
                        }
                    </div>
                    <div className='grid-c-2 gap-30'>
                        <div>
                            <h5 className='mt-20'>Ventajas</h5>
                            <div className='flex column gap-5 mt-10'>
                                {
                                    tool.advantages.map(advantage => <li key={advantage}>{advantage}</li>)
                                }
                            </div>
                        </div>
                        <div>
                            <h5 className='mt-20'>Desventajas</h5>
                            <div className='flex column gap-5 mt-10'>
                                {
                                    tool.disadvantages.map(disadvantage => <li key={disadvantage}>{disadvantage}</li>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='ph-100'>
                <h2>Imágenes</h2>
                <div className='grid-c-3 gap-30'>
                    {
                        tool.images.map((image, index) => <Image key={index} alt={tool.name} src={image} width={500} height={500} className='max-width' />)
                    }
                </div>
            </section>
        </main>
    )
}

export default ToolPage