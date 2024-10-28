import Image from 'next/image';
import React from 'react';

interface Props { 
  toolName: string; 
  description: string;
  img: string;
}


const ToolCardUI = ({toolName, description, img}: Props) => {
  return ( 
    <main>
      <section>
        <div className='p-10 modal-subtitle'>
          <h2 className=''>{toolName}</h2>
          <p className='mt-10'>{description}</p>
        <div className='flex justify-content'>
        <button className='submit-button shadow modal-actions'>Ver más</button>
        </div>
          <Image alt={toolName} src={img} width={500} height={300} className='max-width modal-actions'/>  
        </div>
      </section>
    </main>
  );
}

export default ToolCardUI;