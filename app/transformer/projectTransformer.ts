import { transformedProjectFields } from '../../types/transformer'
import transformer, { getField } from './transformer'
import pictureTransformer from './pictureTransformer'
import richText from '../services/convertRichText'
// calc duration in month
const duration = (startDate, endDate) => {
  // get difference
  const difference = +new Date(endDate) - +new Date(startDate)
  // get duration
  const weeks = Math.floor(difference / 1000 / 60 / 60 / 24 / 7)
  let month = Math.floor(difference / 1000 / 60 / 60 / 24 / 30)
  let years = 0
  // check if more than a year
  if (month > 12) {
    years = Math.floor(month / 12)
    month = month - (years * 12)
  }
  // return duration
  return {
    totalWeeks: weeks,
    years: years,
    month: month
  }
}

export default async (data) => {
  return transformer(data, async (data) => {
    // transform richText
    const content = await richText(getField(data, 'content'), {
      picture: {
        loading: 'lazy',
        sourcesFunction: (picture) => [
          {
            fileType: 'image/webp',
            srcset: [500, 1000, 1400, 2000].map(size => `${picture.image.fields.url}?fm=webp&w=${size} ${size}w`).join(', '),
            sizes: '(min-width: 1400px) 1000px, (min-width: 1000px) 900px, (min-width: 768px) 700px, 100vw'
          }
        ]
      }
    })
    // return format
    return <transformedProjectFields>{
      title: getField(data, 'title'),
      slug: getField(data, 'slug'),
      description: getField(data, 'description'),
      durationStart: getField(data, 'durationStart'),
      durationEnd: getField(data, 'durationEnd'),
      duration: duration(getField(data, 'durationStart'), getField(data, 'durationEnd')),
      years: {
        start: +new Date(getField(data, 'durationStart')).getFullYear(),
        end: +new Date(getField(data, 'durationEnd')).getFullYear()
      },
      client: getField(data, 'client'),
      approach: (await richText(getField(data, 'approach'))).html,
      responsibilities: getField(data, 'responsibilities', []),
      platforms: getField(data, 'platforms', []),
      team: getField(data, 'team', []),
      header: (await pictureTransformer(getField(data, 'header')))[0],
      previewImage: (await pictureTransformer(getField(data, 'previewImage')))[0],
      content: content.html,
      anchors: content.anchors,
      classes: getField(data, 'classes', []).join(' ')
    }
  })
}
