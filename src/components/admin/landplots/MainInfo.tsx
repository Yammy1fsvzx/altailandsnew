interface MainInfoProps {
  title: string
  description: string
  area: number
  price: number
  region: string
  location: string
  landCategory: string
  permittedUse: string
  status: string
  onFieldChange: (name: string, value: string | number) => void
}

export default function MainInfo({
  title,
  description,
  area,
  price,
  region,
  location,
  landCategory,
  permittedUse,
  status,
  onFieldChange
}: MainInfoProps) {
  // Возможные категории земли
  const landCategories = [
    { id: 'СХ', name: 'Сельскохозяйственное назначение' },
    { id: 'ЖС', name: 'Жилая застройка' },
    { id: 'ООТ', name: 'Особо охраняемые территории' },
    { id: 'ЛФ', name: 'Лесной фонд' },
    { id: 'ВФ', name: 'Водный фонд' },
    { id: 'ПН', name: 'Промышленного назначения' }
  ]

  // Возможные виды разрешенного использования
  const permittedUses = [
    { id: 'ЛПХ', name: 'Личное подсобное хозяйство' },
    { id: 'ИЖС', name: 'Индивидуальное жилищное строительство' },
    { id: 'СНТ', name: 'Садоводство и огородничество' },
    { id: 'КФХ', name: 'Крестьянское фермерское хозяйство' },
    { id: 'ПРОЧЕЕ', name: 'Другое' }
  ]

  // Возможные статусы участка
  const statuses = [
    { id: 'AVAILABLE', name: 'Доступен' },
    { id: 'RESERVED', name: 'Забронирован' },
    { id: 'SOLD', name: 'Продан' },
    { id: 'UNAVAILABLE', name: 'Недоступен' }
  ]

  return (
    <>
      <div className="sm:col-span-3">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Название участка *
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            required
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Земельный участок в деревне Иваново"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Статус
        </label>
        <div className="mt-1">
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            {statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Описание
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Подробное описание участка и его преимуществ"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">
          Площадь (соток) *
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="area"
            id="area"
            min="0"
            step="0.01"
            value={area || ''}
            onChange={(e) => onFieldChange('area', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            required
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          Регион
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="region"
            id="region"
            value={region}
            onChange={(e) => onFieldChange('region', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Местоположение
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => onFieldChange('location', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Название поселка, района или ориентира"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="landCategory" className="block text-sm font-medium text-gray-700">
          Категория земли
        </label>
        <div className="mt-1">
          <select
            id="landCategory"
            name="landCategory"
            value={landCategory}
            onChange={(e) => onFieldChange('landCategory', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            {landCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="permittedUse" className="block text-sm font-medium text-gray-700">
          Виды разрешенного использования (ВРИ)
        </label>
        <div className="mt-1">
          <select
            id="permittedUse"
            name="permittedUse"
            value={permittedUse}
            onChange={(e) => onFieldChange('permittedUse', e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            {permittedUses.map(use => (
              <option key={use.id} value={use.id}>
                {use.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Цена (руб.)
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="price"
            id="price"
            min="0"
            step="1000"
            value={price || ''}
            onChange={(e) => onFieldChange('price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    </>
  )
} 