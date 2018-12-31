interface Resource {
   id: string,
   fields: object
}

const cache = require('../services/cacheService')()

export default class Model implements Model {
  private Transformer
  private contentType

  constructor (transformer, type) {
    if (!transformer || typeof transformer !== 'function' || !type || typeof type !== 'string') {
      throw new Error(`'${this.constructor.name}' model can't be initialized, please provide a transformer and the content type.`)
    }
    this.contentType = type
    this.Transformer = transformer
  }

  content (): Array<Object> {
    return new this.Transformer(cache.get(this.contentType)).all()
  }

  all () {
    return this.content()
  }

  find (id: string) {
    return this.content().find((item: Resource) => {
      return item.id === id
    })
  }

  findByField (type: string, value: any) {
    return this.content().find((item: Resource) => {
      return item.fields[type] === value
    })
  }

  findByArrayField (type: string, value: any) {
    return this.content().find((item: Resource) => {
      return item.fields[type] !== undefined && item.fields[type] !== null && item.fields[type].indexOf(value) > -1
    })
  }
}
