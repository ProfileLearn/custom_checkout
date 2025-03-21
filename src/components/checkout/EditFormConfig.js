import React, { useState, useEffect } from 'react';

const EditFormConfig = () => {
  const [config, setConfig] = useState({
    fontSize: 'text-base',
    fontFamily: 'font-sans',
    backgroundImage: '',
    fields: {}
  });

  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');

  // Opciones de configuración
  const fontSizeOptions = [
    { value: 'text-sm', label: 'Pequeño' },
    { value: 'text-base', label: 'Normal' },
    { value: 'text-lg', label: 'Grande' }
  ];

  const fontFamilyOptions = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' }
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/getConfig');
        const result = await response.json();

        if (result.success) {
          setConfig(result.config);
          setPreviewImage(result.config.backgroundImage);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('background', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const { url } = await response.json();
      handleChange('backgroundImage', url);
      setPreviewImage(url);

    } catch (error) {
      console.error('Error subiendo imagen:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Error al guardar');
      alert('Configuración guardada exitosamente!');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  if (isLoading) return <div className="p-4">Cargando configuración...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Editar Configuración</h1>

      {/* Selector de tamaño de fuente */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Tamaño de fuente</label>
        <select
          value={config.fontSize}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          className="w-full p-2 border rounded"
        >
          {fontSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de tipo de letra */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Familia tipográfica</label>
        <select
          value={config.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full p-2 border rounded"
        >
          {fontFamilyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subida de imagen */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Imagen de fondo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
        {previewImage && (
          <div className="mt-4 w-64 h-32 border rounded overflow-hidden">
            <img
              src={previewImage}
              alt="Previsualización"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default EditFormConfig;