import pageTransformer from '../transformer/new/pageTransformer'
// templates
import { templateInterface } from '../../types/template'
import page from '../templates/pages/page'
import homepage from '../templates/pages/homepage'

const { renderToString } = require('@popeindustries/lit-html-server')
const cache = require('../services/cacheService')()

const templates: {[key:string]: templateInterface} = {
  page: page,
  homepage: homepage
}

module.exports = async (req, res, template: string = 'page') => {
  // console.debug(`DEBUG message: URL is "${req.url}" template is "${template}"`) // print current template
  // get slug
  const slug = req.path.replace(/^\/|\/$/g, '')
  // get content
  const content = await pageTransformer(cache.get('page'))
  // get this page
  const pageContent = content.find((item: any) => item.fields.slug === slug).fields
  // return final page
  return res.send(await renderToString(templates[template](pageContent, req)))
}
