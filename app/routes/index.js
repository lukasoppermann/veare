const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const contentfulConfig = require('../config/contentful.js')

/* =================
// Normal Routes
================= */
router.get(/^\/fragment\/menu$/, (req, res) => {
  res.render('menu')
})
router.get(/^\/?$/, (req, res) => {
  res.render('progressive', {
    filesStringify: {
      js: JSON.stringify(req.app.locals.files.js),
      css: JSON.stringify(req.app.locals.files.css)
    }
  })
})
router.get(/^\/home$/, require('./home'))
router.use('/portfolio', require('./portfolio'))
router.get('/privacy', (req, res) => require('./pages')(req, res, 'privacy'))
router.get('/about', (req, res) => { res.redirect('/#about') })
router.get('/contact', (req, res) => { res.redirect('/#contact') })
router.get('/blog', require('./blog'))
router.get(/^\/blog\/([\w-]+)/, require('./blog'))
router.get(/^\/work\/([\w-]+)/, require('./projects'))
/* =================
// UTILS
================= */
// return revisioned files json
router.use('/revisionedFiles', require('./revisionedFiles'))
// activate webhook
router.post('/contentful', basicAuth({
  users: {
    [contentfulConfig.webhookUser]: contentfulConfig.webhookPassword
  }
}), require('../services/contentfulWebhook'))
// log non-existent pages
router.get('/:pageCalled', (req, res) => {
  console.log('tried to retrieve non-existing page: ' + req.params.pageCalled)
  res.redirect('/')
})

module.exports = router
