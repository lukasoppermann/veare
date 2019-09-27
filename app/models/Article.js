'use strict'

const Model = require('./Model')
const ArticleTransformer = require('../transformer/ArticleTransformer')

class Article extends Model {
  constructor () {
    super(ArticleTransformer, 'article')
  }

  all () {
    return super.all().sort((a, b) => {
      let dateA = new Date(a.fields.rawdate)
      let dateB = new Date(b.fields.rawdate)
      if (dateA < dateB) {
        return 1
      }
      if (dateA > dateB) {
        return -1
      }
      return 0
    })
  }

  findBySlug (slug) {
    return this.findByField('slug', slug)
  }
}

module.exports = () => new Article()
