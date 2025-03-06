import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(file: File, type: 'image' | 'document'): Promise<{ path: string; url: string }> {
  try {
    // Создаем уникальное имя файла
    const fileName = `${uuidv4()}${path.extname(file.name)}`
    
    // Определяем путь для сохранения
    const directory = type === 'image' ? 'uploads/images' : 'uploads/documents'
    const fullPath = path.join(process.cwd(), 'public', directory)
    
    // Создаем директорию, если она не существует
    await mkdir(fullPath, { recursive: true })
    
    // Преобразуем File в Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Сохраняем файл
    const filePath = path.join(fullPath, fileName)
    await writeFile(filePath, buffer)
    
    // Возвращаем пути для сохранения в БД
    return {
      path: `${directory}/${fileName}`,
      url: `/${directory}/${fileName}`
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
} 