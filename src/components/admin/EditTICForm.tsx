'use client';
export const EditTICForm = () => {
  return (
    <form action="" className="flex column mt-20">
      <label htmlFor="name">Nombre de la herramienta</label>
      <input type="text" className="mt-10" placeholder="Ingrese texto aquí" />
      <div className="mt-50 ph-40">
        <p>Categoría</p>
        {/* Create checkboxs to select categories */}
        <div className="grid-c-2 mt-10">
          <label htmlFor="">
            <input type="checkbox" />Estimación
          </label>
          <label htmlFor="">
            <input type="checkbox" />Herramientas Integrales</label>
          <label htmlFor="">
            <input type="checkbox" name="" id="" />
            Gestión de Calendarios
          </label>
          <label htmlFor="">
            <input type="checkbox" name="" id="" />
            Gestión de Riesgos
          </label>
          <label htmlFor="">
            <input type="checkbox" name="" id="" />
            Otro
          </label>
        </div>
      </div>
      <label htmlFor="description" className="mt-50">Descripción</label>
      <textarea name="" id="" cols={30} rows={10} className="mt-10" placeholder="Ingrese texto aquí"></textarea>
      <div className="grid-c-2 mt-50 gap-30">
        <div>
          <p>Ventajas</p>
          <div className="flex mt-10 align-center gap-15">
            <i className="fa-solid fa-plus radius-100 black-border p-5"></i>
            <div>
              <input type="text" placeholder="Ingrese texto aquí" />
            </div>
          </div>
          <p className="f-size-12 mt-10">Escriba los adjetivos que mejor describan las ventajas de la herramienta TIC separados por comas</p>
        </div>
        <div>
          <p>Desventajas</p>
          <div className="flex mt-10 align-center gap-15">
            <i className="fa-solid fa-plus radius-100 black-border p-5"></i>
            <div>
              <input type="text" placeholder="Ingrese texto aquí" />
            </div>
          </div>
          <p className="f-size-12 mt-10">Escriba los adjetivos que mejor describan las ventajas de la herramienta TIC separados por comas</p>
        </div>
      </div>
      <p className="mt-50">Casos de uso</p>
      <div className="flex mt-10 align-center gap-15">
        <i className="fa-solid fa-plus radius-100 black-border p-5"></i>
        <div>
          <input type="text" placeholder="Ingrese texto aquí" />
        </div>
      </div>
      <p className="f-size-12 mt-10">Escriba los adjetivos que mejor describan las ventajas de la herramienta TIC separados por comas</p>
      <div className="mt-50 grid-40-60 gap-30">
        <div>
          <p>Logo</p>
          {/* UPLOAD LOGO */}
        </div>
        <div>
          Imágenes
        </div>
      </div>
    </form>
  )
}
