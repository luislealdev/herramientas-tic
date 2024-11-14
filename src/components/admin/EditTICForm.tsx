'use client';
import { useForm } from "react-hook-form";
import { TextArea, Button } from '@carbon/react';
import { Add, TrashCan } from '@carbon/react/icons';
import { Category, Tool } from "@prisma/client";
import { useRouter } from 'next/navigation';
import { createUpdateTool } from "@/actions";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

interface Props {
  tool: Partial<Tool> & { images?: string[], categories?: Category[] };
  categories: Category[];
}

interface FormInputs {
  name: string;
  description: string;
  advantages: string;
  disadvantages: string;
  useCases: string;
  categories: string;
  images?: FileList;
  logo?: File;
}

export const EditTICForm = ({ tool, categories }: Props) => {
  const router = useRouter();
  const { handleSubmit, register, setValue, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      name: tool.name,
      description: tool.description,
      advantages: tool.advantages ? tool.advantages.join(',') : '',
      disadvantages: tool.disadvantages ? tool.disadvantages.join(',') : '',
      useCases: tool.useCases ? tool.useCases.join(',') : '',
      categories: tool.categories ? tool.categories.map((category) => category.id).join(',') : '',
      images: undefined,
      logo: undefined,
    },
  });

  const [advantages, setAdvantages] = useState<string[]>(tool.advantages || []);
  const [disadvantages, setDisadvantages] = useState<string[]>(tool.disadvantages || []);
  const [useCases, setUseCases] = useState<string[]>(tool.useCases || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    tool.categories ? tool.categories.map((category) => category.id) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(tool.images || []);

  useEffect(() => {
    if (tool) {
      setValue('name', tool.name || '');
      setValue('description', tool.description || '');
      setValue('advantages', tool.advantages?.join(',') || '');
      setValue('disadvantages', tool.disadvantages?.join(',') || '');
      setValue('useCases', tool.useCases?.join(',') || '');
      setValue('categories', tool.categories?.map((category) => category.id).join(',') || '');
    }
  }, [tool, setValue]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const compressedImages = await Promise.all(
        files.map(async (file) => {
          try {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 800,
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            return URL.createObjectURL(compressedFile);
          } catch (error) {
            console.error('Error al comprimir imagen:', error);
            return URL.createObjectURL(file);
          }
        })
      );
      setPreviewImages([...previewImages, ...compressedImages]);
      setNewImages([...newImages, ...files]);
    }
  };

  const handleImageRemove = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleExistingImageRemove = (imageUrl: string) => {
    setExistingImages(existingImages.filter(image => image !== imageUrl));
  };

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);

    register("categories", {
      validate: () => selectedCategories.length > 0 || "Debes seleccionar al menos una categoría"
    });

    const userId = session?.user?.id;

    if (!userId) {
      alert("No se pudo obtener el ID del usuario");
      return;
    }

    // Validación manual de categorías seleccionadas
    if (selectedCategories.length === 0) {
      alert("Debes seleccionar al menos una categoría");
      return;
    }

    const formData = new FormData();

    const { logo, ...toolToSave } = data;

    formData.append("userId", userId)

    if (tool.id) {
      formData.append("id", tool.id ?? "");
    }

    formData.append("name", toolToSave.name);
    formData.append("description", toolToSave.description);
    formData.append("advantages", toolToSave.advantages);
    formData.append("disadvantages", toolToSave.disadvantages);
    formData.append("useCases", toolToSave.useCases);
    formData.append("categories", selectedCategories.join(','));

    if (logo) {
      formData.append("logo", logo);
    }

    if (newImages) {
      for (let i = 0; i < newImages.length; i++) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(newImages[i], options);
        formData.append('images', compressedFile);
      }
    }

    const { ok, tool: updatedTool } = await createUpdateTool(formData);

    if (!ok) {
      alert('Herramienta no se pudo actualizar');
      return;
    }

    setIsSubmitting(false);
    router.replace(`/admin/tic/${updatedTool?.slug}`);
  };

  const handleAddAdvantage = () => {
    const advantage = (document.getElementById("advantageInput") as HTMLInputElement).value;
    if (advantage) {
      setAdvantages([...advantages, advantage]);
      setValue("advantages", [...advantages, advantage].join(','));
    }
  };

  const handleAddDisadvantage = () => {
    const disadvantage = (document.getElementById("disadvantageInput") as HTMLInputElement).value;
    if (disadvantage) {
      setDisadvantages([...disadvantages, disadvantage]);
      setValue("disadvantages", [...disadvantages, disadvantage].join(','));
    }
  };

  const handleAddUseCase = () => {
    const useCase = (document.getElementById("useCaseInput") as HTMLInputElement).value;
    if (useCase) {
      setUseCases([...useCases, useCase]);
      setValue("useCases", [...useCases, useCase].join(','));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex column mt-20">
      <label htmlFor="name">Nombre de la herramienta</label>
      <input
        {...register("name", { required: "El nombre es obligatorio" })}
        type="text"
        className="mt-10"
        placeholder="Ingrese texto aquí"
      />
      {errors.name && <p className="error">{errors.name.message}</p>}

      <div className="mt-50 ph-40">
        <p>Categoría</p>
        {categories.map((category) => (
          <label key={category.id} htmlFor={category.id}>
            <input
              type="checkbox"
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
            />
            {category.name}
          </label>
        ))}
        {selectedCategories.length === 0 && <p className="error">Debes seleccionar al menos una categoría</p>}
      </div>

      <label htmlFor="description" className="mt-50">Descripción</label>
      <TextArea
        {...register("description", { required: "La descripción es obligatoria" })}
        labelText="Ingrese texto aquí"
      />
      {errors.description && <p className="error">{errors.description.message}</p>}

      <div className="grid-c-2 mt-50 gap-30">
        <div>
          <p>Ventajas</p>
          <div className="flex mt-10 align-center gap-15">
            <Add onClick={handleAddAdvantage} />
            <input id="advantageInput" type="text" placeholder="Ingrese una ventaja" />
          </div>
          <ul>
            {advantages.map((adv, index) => (
              <li key={index}>{adv}</li>
            ))}
          </ul>
        </div>

        <div>
          <p>Desventajas</p>
          <div className="flex mt-10 align-center gap-15">
            <Add onClick={handleAddDisadvantage} />
            <input id="disadvantageInput" type="text" placeholder="Ingrese una desventaja" />
          </div>
          <ul>
            {disadvantages.map((disadv, index) => (
              <li key={index}>{disadv}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-50">Casos de uso</p>
      <div className="flex mt-10 align-center gap-15">
        <Add onClick={handleAddUseCase} />
        <input id="useCaseInput" type="text" placeholder="Ingrese un caso de uso" />
      </div>
      <ul>
        {useCases.map((useCase, index) => (
          <li key={index}>{useCase}</li>
        ))}
      </ul>

      <div className="mt-50 grid-40-60 gap-30">
        <div>
          <p>Logo</p>
          <div className="flex mt-10 align-center gap-15">
            <input
              {...register("logo", {
                required: tool.images ? false : "El logo es obligatorio",
              })}
              type="file"
            />
          </div>
          {errors.logo && <p className="error">{errors.logo.message}</p>}
        </div>

        <div>
          <p>Imágenes</p>
          <div className="flex mt-10 align-center gap-15">
            <input
              {...register("images", {
                required: tool.images && tool.images.length > 0 ? false : "Las imágenes son obligatorias"
              })}
              multiple
              type="file"
              onChange={handleImageUpload}
            />
          </div>
          {errors.images && <p className="error">{errors.images.message}</p>}
        </div>
      </div>

      {existingImages.length > 0 && (
        <div className="grid-c-4 mt-20 gap-30">
          {existingImages.map((image, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <Image width={1000} height={1000} src={image} alt={`Existing Image ${index}`} className="existing-image max-width" />
              <Button
                className="no-border p-10"
                style={{ position: "absolute", top: 0, right: 0 }}
                renderIcon={TrashCan}
                onClick={() => handleExistingImageRemove(image)}
              >
              </Button>
            </div>
          ))}
        </div>
      )}

      {previewImages.length > 0 && (
        <div className="grid-c-4 mt-20 gap-30">
          {previewImages.map((src, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <Image width={1000} height={1000} src={src} alt={`Preview ${index}`} className="preview-image auto-height" />
              <Button
                renderIcon={TrashCan}
                onClick={() => handleImageRemove(index)}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}

      <button className="mt-50 p-10" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar herramienta"}
      </button>
    </form>
  );
};