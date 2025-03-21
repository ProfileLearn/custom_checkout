import React, { useState, useEffect } from 'react';

const CheckoutForm = ({ configUrl = 'api/getConfig', onSubmit }) => {
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(configUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Extraemos la config desde la propiedad 'config'
        const configData = data.config;
        setConfig(configData);
        const initialData = configData.fields
          ? Object.keys(configData.fields).reduce((acc, field) => {
            acc[field] = '';
            return acc;
          }, {})
          : {};
        setFormData(initialData);
      })
      .catch(error => {
        console.error('Error loading config:', error);
        setError('Error loading config');
      });
  }, [configUrl]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = Object.entries(config.fields)
      .filter(([field, fieldConfig]) => fieldConfig.required && !formData[field])
      .map(([field]) => config.fields[field].label);

    if ((formData.ivaCondition === 'IVA responsable inscripto' || formData.ivaCondition === 'Responsable monotributo') && !formData.cuit) {
      missingFields.push('CUIT');
    }

    if (formData.ivaCondition === 'Consumidor final' && !formData.dni) {
      missingFields.push('DNI');
    }

    if (missingFields.length > 0) {
      setError(`Faltan campos requeridos: ${missingFields.join(', ')}`);
      return;
    }

    setError('');
    onSubmit(formData);
  };

  if (!config) return <div className="p-4">Cargando configuración...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col space-y-4 max-w-md mx-auto my-8 p-6 rounded-lg shadow-md ${config.fontSize} ${config.fontFamily}`}
      style={{
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
        if (!fieldConfig.show) return null;

        return (
          <div key={fieldName} className="form-group">
            <label
              htmlFor={fieldName}
              className={`block text-gray-700 mb-1 ${config.fontSize} ${config.fontFamily}`}
            >
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {fieldConfig.type === 'select' ? (
              <select
                id={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${config.fontFamily === 'font-mono' ? 'font-mono' : ''}`}
                aria-required={fieldConfig.required}
              >
                <option value="">Seleccionar...</option>
                {fieldConfig.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={fieldName}
                type={fieldConfig.type}
                value={formData[fieldName]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${config.fontFamily === 'font-mono' ? 'font-mono' : ''}`}
                aria-required={fieldConfig.required}
              />
            )}
          </div>
        );
      })}

      {(formData.ivaCondition === 'IVA responsable inscripto' || formData.ivaCondition === 'Responsable monotributo') && (
        <div className="form-group">
          <label htmlFor="cuit" className="block text-gray-700 mb-1">CUIT</label>
          <input
            id="cuit"
            type="text"
            value={formData.cuit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            aria-required="true"
          />
        </div>
      )}

      {formData.ivaCondition === 'Consumidor final' && (
        <div className="form-group">
          <label htmlFor="dni" className="block text-gray-700 mb-1">DNI</label>
          <input
            id="dni"
            type="text"
            value={formData.dni}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            aria-required="true"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${config.fontSize}`}
      >
        Continuar al pago
      </button>
    </form>
  );
};

export default CheckoutForm;