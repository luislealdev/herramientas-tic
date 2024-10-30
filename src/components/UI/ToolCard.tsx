import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  toolName: string;
  description: string;
  img: string;
  slug: string;
}


const ToolCardUI = ({ toolName, description, img, slug }: Props) => {
  return (
    <div className='p-20 modal-subtitle bg-gray-m'>
      <h2 className=''>{toolName}</h2>
      <p className='mt-10'>{description}</p>
      <Image alt={toolName} src={img} width={500} height={300} className='max-width modal-actions' />
      <div className='flex justify-content'>
        <Link href={`/herramienta/${slug}`} className='submit-button shadow modal-actions'>Ver más</Link>
      </div>
    </div>
  );
}

export default ToolCardUI;