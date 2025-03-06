import { XCircleIcon } from '@heroicons/react/24/outline'

interface TagInputProps {
  label: string
  tags: string[]
  inputValue: string
  onInputChange: (value: string) => void
  onAddTag: () => void
  onRemoveTag: (index: number) => void
  placeholder: string
  tagClassName?: string
}

export default function TagInput({
  label,
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  placeholder,
  tagClassName = "bg-green-100 text-green-800"
}: TagInputProps) {
  return (
    <div className="sm:col-span-6">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={onAddTag}
            className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Добавить
          </button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-md ${tagClassName}`}>
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTag(index)}
                  className="ml-1 inline-flex text-green-400 hover:text-green-500"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 