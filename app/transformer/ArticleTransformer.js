'use strict'

const Transformer = require('./Transformer')
const Category = require('../models/Category')
const Author = require('../models/Author')
const AssetTransformer = require('./AssetTransformer')
const ChapterTransformer = require('./ChapterTransformer')
const readingTime = require('reading-time')

class ArticleTransformer extends Transformer {
  transform (data) {
    return {
      id: data.sys.id,
      contentType: data.sys.contentType.sys.id,
      createdAt: data.sys.createdAt,
      updatedAt: data.sys.updatedAt,
      fields: {
        slug: this.getContent(data, 'slug'),
        title: this.getContent(data, 'title'),
        banner: new AssetTransformer(this.getContent(data, 'banner')).first(),
        rawdate: this.getContent(data, 'date'),
        date: this.formatDate(this.getContent(data, 'date')),
        preview: this.getContent(data, 'preview'),
        chapters: new ChapterTransformer(this.getContent(data, 'chapters')),
        readingTime: 'Needs to be programmed' /* Math.ceil(readingTime(this.getContent(data, 'content') || '').time / 60000) */,
        category: new Category().find(this.getContent(data, 'category').sys.id),
        author: new Author().find(this.getContent(data, 'author').sys.id)
      }
    }
  }
}

module.exports = ArticleTransformer
