import React, { useState, useEffect } from 'react';

const EditFormConfig = () => {
  const [config, setConfig] = useState({
    backgroundImage: '',
    fontSize: 'text-base',
    fontFamily: 'font-sans',
    fields: {}
  });

  const [previewImage, setPreviewImage] = useState('');

  // Opciones de configuración
  const fontSizeOptions = [
    { value: 'text-sm', label: 'Pequeño (text-sm)' },
    { value: 'text-base', label: 'Normal (text-base)' },
    { value: 'text-lg', label: 'Grande (text-lg)' }
  ];

  const fontFamilyOptions = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' }
  ];

  // Cargar configuración inicial
  useEffect(() => {
    fetch('/formConfig.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  // Manejar cambios en los inputs
  const handleFontSizeChange = (e) => {
    setConfig(prev => ({ ...prev, fontSize: e.target.value }));
  };

  const handleFontFamilyChange = (e) => {
    setConfig(prev => ({ ...prev, fontFamily: e.target.value }));
  };

  // Manejar subida de imagen
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

      if (!response.ok) throw new Error('Error subiendo imagen');

      const { url } = await response.json();
      setConfig(prev => ({ ...prev, backgroundImage: url }));
      setPreviewImage(url);

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  // Guardar configuración
  const handleSaveConfig = async () => {
    try {
      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) throw new Error('Error guardando configuración');
      alert('Configuración guardada!');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-6">Editar Configuración del Checkout</h1>

      {/* Selector de imagen */}
      <div className="mb-6">
        <label className="block mb-2">Imagen de fondo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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

      {/* Selector de tamaño de fuente */}
      <div className="mb-6">
        <label className="block mb-2">Tamaño de fuente:</label>
        <select
          value={config.fontSize}
          onChange={handleFontSizeChange}
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
        <label className="block mb-2">Tipo de letra:</label>
        <select
          value={config.fontFamily}
          onChange={handleFontFamilyChange}
          className="w-full p-2 border rounded"
        >
          {fontFamilyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSaveConfig}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Guardar Configuración
      </button>
    </div>
  );
};

export default EditFormConfig;