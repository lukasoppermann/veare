const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')
const contentfulWebhook = require('./contentfulWebhook')
const Blog = require('../controller/Blog')
const blog = new Blog()

let env = process.env.NODE_ENV || 'dev'
const PORT = process.env.NODE_PORT || 8080

module.exports = (app) => {
  return (response) => {
    let files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
    // change object keys
    Object.keys(files).forEach((key) => {
      let newKey = key.replace('.', '').substring(key.lastIndexOf('/') + 1)
      files[newKey] = files[key]
      delete files[key]
    })
    let portfolioItems = JSON.parse(fs.readFileSync('resources/templates/data/portfolio.json'))
    // dev
    if (env === 'dev') {
      app.use(/\/[a-z_/]*/, function (req, res, next) {
        files = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
        // change object keys
        Object.keys(files).forEach((key) => {
          let newKey = key.replace('.', '').substring(key.lastIndexOf('/') + 1)
          files[newKey] = files[key]
          delete files[key]
        })
        // console.log('parsed files: ', files)
        next()
      })
    }
    //
    app.use(bodyParser.json({ type: 'application/*+json' }))
    // contentful webhook
    app.post('/contentful', basicAuth({
      users: {
        [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
      }
    }), contentfulWebhook)
    // index
    app.get('/', function (req, res) {
      res.render('index', {
        files: files,
        pageClass: 'c-page--index',
        portfolioItems: portfolioItems
      })
    })
    // home & contact
    app.get(/^\/(home)/, function (req, res) {
      res.render('index', {
        files: files,
        pageClass: 'c-page--index',
        portfolioItems: portfolioItems
      })
    })
    // imprint & privacy
    app.get(/^\/(imprint|privacy)/, function (req, res) {
      res.render(req.params[0], {
        files: files,
        pageClass: 'c-page--' + req.params[0]
      })
    })
    // About
    app.get(/^\/about\/([\w-]+)?$/, function (req, res) {
      res.redirect('/#about')
    })
    // contact
    app.get(/^\/contact\/([\w-]+)?$/, function (req, res) {
      res.redirect('/#contact')
    })
    // Blog
    app.get(/^\/blog\/?$/, (req, res) => blog.index(req, res, {
      files: files,
      pageClass: 'c-page--blog'
    }))
    app.get(/^\/blog\/([\w-]+)/, (req, res) => blog.get(req, res, {
      files: files,
      pageClass: 'c-page--blog'
    }))
    // Portfolio
    // no portfolio item selected
    app.get(/^\/portfolio\/?$/, function (req, res) {
      res.redirect('/#portfolio')
    })
    // show portfolio item
    app.get(/^\/portfolio\/?([\w-]*)$/, function (req, res) {
      res.render('./portfolio/' + req.params[0] + '.hbs', {
        files: files,
        pageClass: 'c-page--portfolio-item'
      }, function (err, html) {
        if (err) {
          console.log(err)
          res.redirect('/#portfolio')
        }
        res.send(html)
      })
    })
    // static content
    app.use(express.static('public'))
    // open port
    app.listen(PORT)
    if (env !== 'testing') {
      console.log('Running on http://localhost:' + PORT + ' environment is set to "' + env + '"')
    }
  }
}
