import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS, INLINES } from '@contentful/rich-text-types'
import { richTextConverted } from '../../types/richText.d'
import slugToUrl from './slugToUrl'
// templates
import block from '../templates/newPartials/block'
import code from '../templates/newPartials/code'
import picture from '../templates/newPartials/picture'
import projectExcerpt from '../templates/newPartials/project_excerpt'
import link from '../templates/newPartials/link'
// Transformer
import blockTransformer from '../transformer/blockTransformer'
import pictureTransformer from '../transformer/pictureTransformer'
import codeTransformer from '../transformer/codeTransformer'
import projectTransformer from '../transformer/projectTransformer'
import linkTransformer from '../transformer/linkTransformer'
import tokenTransformer from '../transformer/tokenTransformer'

const { renderToString } = require('@popeindustries/lit-html-server')

// Transformer functions
const transformerFunctions = {
  block: blockTransformer,
  project: projectTransformer,
  code: codeTransformer,
  picture: pictureTransformer,
  link: linkTransformer,
  token: tokenTransformer
}

// templates functions for embeddedEntries
const templates = {
  block: block,
  project: projectExcerpt,
  code: code,
  picture: picture,
  link: link
}
// test if link is internal
const isInternal = link => link.substr(0, 1) === '/' && link.substr(1, 2) !== '/'
/**
 * convertHyperlinks
 * @param  node          richTextNode
 * @param  next
 * @return                   [description]
 */
const convertHyperlinks = (node, next, anchors) => {
  // split uri
  const uri = node.data.uri.split('#')
  // test if link is anchor
  if (uri[0] === 'name=') {
    const name = uri[1].toLowerCase().replace(/\s/g, '-').replace(/[^&-A-Za-z0-9]/g, '')
    // store anchor in data store
    anchors.push(name)
    // return anchor link with name tag
    return `<a name="${name}">${next(node.content)}</a>`
  }
  // return internal link
  if (isInternal(node.data.uri)) {
    return `<a href="${node.data.uri}">${next(node.content)}</a>`
  }
  // return external
  return `<a href="${node.data.uri}" rel="noopener noreferrer nofollow" target="_blank">${next(node.content)}</a>`
}
/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, templates: {[key: string]: Function}, transformerFunctions: {[key: string]: Function}, options = {}): Promise<Array<any>> => {
  // return if richText is empty
  if (richText === null) {
    return []
  }
  // await conversion to resolve
  return Promise.all(
    // all nodes from richText
    richText.content
      // filter to only embedded-entry-block
      .filter(node => node.nodeType === 'embedded-entry-block')
      // trasform data and convert to HTML
      .map(async node => {
        // run transformer on data
        try {
          const transfomedData = await transformerFunctions[node.data.target.sys.contentType.sys.id](node.data.target)
          // set template options
          let templateOptions = {}
          if (options[node.data.target.sys.contentType.sys.id] !== undefined) {
            templateOptions = options[node.data.target.sys.contentType.sys.id]
          }
          // return id & html
          return {
            // unique id of the node
            id: node.data.target.sys.id,
            // converted HTML
            html: await renderToString(templates[node.data.target.sys.contentType.sys.id](transfomedData[0].fields, templateOptions))
          }
        } catch (e) {
          /* istanbul ignore next */
          console.error(`🚨 \x1b[31mError: Trying to convert and render embedded entry of type "${node.data.target.sys.contentType.sys.id}"\x1b[0m \n Error: ${e}`)
        }
      })
  )
}
/**
 * async convertRichText
 * @param  richText contentful
 * @return          [description]
 */
export default async (richText: richTextDocument, options?): Promise<richTextConverted> => {
  // get all converted embedded-entries
  const embedded = await convertEmbeddedEntries(richText, templates, transformerFunctions, options)
  // reset anchor variable
  const anchors: Array<string> = []
  // convert richText as HTML
  const html: string = documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return embedded.find((entry: any) => entry.id === node.data.target.sys.id).html
        } catch (e) {
          /* istanbul ignore next */
          // console.error('🚨 ERROR: ', e)
          // console.error('🚨 ERROR: ', embedded)
          /* istanbul ignore next */
          // console.dir(node.data.target, { depth: null, colors: true })
        }
      },
      [BLOCKS.HR]: () => '<div class="Rule--horizontal"><hr></div>',
      [INLINES.HYPERLINK]: (node, next) => convertHyperlinks(node, next, anchors),
      [INLINES.ENTRY_HYPERLINK]: (node, next) => `<a href="${slugToUrl(node.data.target.fields.slug['en-US'], node.data.target.sys.contentType.sys.id)}">${next(node.content)}</a>`,
      [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content).replace('\n', '<br/>')}</p>`
    }
  })
  // return data object
  return {
    html: html,
    anchors: anchors
  }
}

export const __testing = {
  convertHyperlinks: convertHyperlinks,
  convertEmbeddedEntries: convertEmbeddedEntries
}
