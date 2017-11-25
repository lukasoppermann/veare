const fs = require('fs')
const expressHandlebars = require('express-handlebars')
const SVGO = require('svgo')
const deasync = require('deasync')

const svgo = new SVGO({
  plugins: [
    { removeEditorsNSData: {
      additionalNamespaces: ['http://www.figma.com/figma/ns']}
    },
    { removeDesc: {removeAny: true} },
    { removeTitle: {} }, // pass it an argument to enable
    'removeComments', // does enable default plugins. (using { full: true } )
    'removeMetadata',
    {removeViewBox: false}
  ]
})

module.exports = expressHandlebars.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: './resources/templates/partials/layouts',
  partialsDir: './resources/templates/partials',
  helpers: {
    url_safe: function (url) {
      url = url.replace(/[`:]/g, '').replace(/[\W_]+/g, '-')
      return escape(url)
    },
    join: function () {
      let args = Array.from(Object.values(arguments)).slice(0, -1)
      return args.join(' ')
    },
    year: function () {
      return new Date().getFullYear()
    },
    inline_svg: function (path, options) {
      // optimizing fn
      function svgoOptimizeSync (svgo, path) {
        let res = null
        let svg = fs.readFileSync(path, 'utf8')
        svgo.optimize(svg, {path: path}).then(result => { res = result })
        deasync.loopWhile(() => !res)
        return res.data
      }
      // prep attributes
      let attrs = Object.keys(options.hash || {}).map(function (key) {
        return key + '="' + options.hash[key] + '"'
      }).join(' ')

      return svgoOptimizeSync(svgo, path).replace(/<svg/g, `<svg ${attrs}`)
    }
  }
})
