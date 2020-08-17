import { transformedFields } from '../../types/transformer'
import transformer, { getField } from './transformer'

export default async (data) => {
  return transformer(data, async (data) => {
    // return format
    return <transformedFields>{
      title: getField(data, 'title'),
      description: getField(data, 'description'),
      url: getField(data, 'file').url,
      fileName: getField(data, 'file').fileName,
      details: getField(data, 'file').details,
      sizeInBytes: getField(data, 'file').details.size,
      width: getField(data, 'file').details.image.width,
      height: getField(data, 'file').details.image.height,
      contentType: getField(data, 'file').contentType
    }
  })
}
