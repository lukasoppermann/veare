import { middleware } from '../../types/middleware'
import { templateInterface } from '../../types/template'
import page from '../templates/pages/page'
import homepage from '../templates/pages/homepage'
import cache from '../services/cacheService'
const { renderToString } = require('@popeindustries/lit-html-server')

const templates: {[key:string]: templateInterface} = {
  page: page,
  homepage: homepage
}

const route: middleware = async (req, res, _next, template: string = 'page') => {
  // get slug
  const slug = (req.url || '').replace(/^\/|\/$/g, '').split('?')[0]
  // get content
  const content = cache.get('page')
  // get this page
  const pageContent = content.find((item: any) => item.fields.slug === slug).fields
  // set header format
  res.setHeader('Content-Type', 'text/html')
  // return page
  return res.end(await renderToString(templates[template](pageContent, req)))
}

export default route
