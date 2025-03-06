import React from 'react';

interface StationFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  formData: {
    name: string;
    city: string;
  };
  onInputChange: (name: string, value: string) => void;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Модальне вікно для додавання/редагування станції
 */
const StationFormModal: React.FC<StationFormModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSave,
  formData,
  onInputChange,
  isProcessing,
  error
}) => {
  if (!isOpen) return null;

  const title = mode === 'add' ? 'Додати нову станцію' : 'Редагувати станцію';
  const buttonText = mode === 'add' ? 'Додати' : 'Зберегти';

  // Обробник для запобігання закриття модалки при кліку на її вміст
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-dark-800 rounded-lg shadow-xl w-full max-w-md"
        onClick={handleModalContentClick}
      >
        {/* Заголовок модального вікна */}
        <div className="px-6 py-4 border-b border-dark-600">
          <h3 className="text-lg font-medium text-accent-bright">{title}</h3>
        </div>
        
        {/* Форма */}
        <form onSubmit={onSave}>
          <div className="px-6 py-4 space-y-4">
            {/* Поле для назви станції */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-accent-light mb-1">
                Назва станції*
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 rounded-md bg-dark-700 border border-dark-600 focus:outline-none focus:ring-1 focus:ring-accent text-accent-bright"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                placeholder="Введіть назву станції"
                required
              />
            </div>
            
            {/* Поле для міста */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-accent-light mb-1">
                Місто*
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-4 py-2 rounded-md bg-dark-700 border border-dark-600 focus:outline-none focus:ring-1 focus:ring-accent text-accent-bright"
                value={formData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                placeholder="Введіть назву міста"
                required
              />
            </div>
            
            {/* Відображення помилки */}
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
          </div>
          
          {/* Кнопки дій */}
          <div className="px-6 py-3 border-t border-dark-600 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-dark-700 hover:bg-dark-600 text-accent-light transition-colors"
              onClick={onClose}
              disabled={isProcessing}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-dark-900 transition-colors"
              disabled={isProcessing}
            >
              {isProcessing ? 'Збереження...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationFormModal; 