const express = require('express')
const router = express.Router()
const helmetSettings = require('../config/helmet-settings.js')

router.use(express.json({ type: 'application/*+json' }))
router.use(require('compression')())
// router.use(require('./nounce'))
router.use(require('helmet')(helmetSettings))
router.use(express.static('public', { maxAge: '365d' }))

module.exports = router
