interface DocumentUploaderProps {
  documentFiles: File[]
  documentNames: string[]
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveDocument: (index: number) => void
}

export default function DocumentUploader({
  documentFiles,
  documentNames,
  onDocumentUpload,
  onRemoveDocument
}: DocumentUploaderProps) {
  return (
    <>
      <div className="sm:col-span-6">
        <label className="block text-sm font-medium text-gray-700">Прикрепленные документы</label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="document-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
              >
                <span>Загрузить документы</span>
                <input 
                  id="document-upload" 
                  name="document-upload" 
                  type="file" 
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="sr-only" 
                  onChange={onDocumentUpload}
                />
              </label>
              <p className="pl-1">или перетащите сюда</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOC, XLS до 10MB</p>
          </div>
        </div>
      </div>

      {/* Список загруженных документов */}
      {documentNames.length > 0 && (
        <div className="sm:col-span-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Загруженные документы</h4>
          <ul className="border rounded-md divide-y divide-gray-200">
            {documentNames.map((name, index) => (
              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-0 flex-1 flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 flex-1 w-0 truncate">{name}</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveDocument(index)}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
} 