const fs = require('fs')
// get revisioned files in object
const getRevFiles = (): {
  css: {
    [key: string]: string
  },
  js: {
    [key: string]: string
  },
  media: {
    [key: string]: string
  }
} => {
  // get revisioned files
  const revFiles = JSON.parse(fs.readFileSync('public/rev-manifest.json', 'utf8'))
  // create files structure
  const files = {
    css: {},
    js: {},
    media: {}
  }
  // add revisioned files to structure
  Object.keys(revFiles).map(key => {
    files[key.slice(0, key.indexOf('/'))][key] = revFiles[key]
  })
  // return object
  return files
}
// set revisionedFiles
let revisionedFiles = getRevFiles()

module.exports = (refresh: boolean = false): {
  css: {
    [key: string]: string
  },
  js: {
    [key: string]: string
  },
  media: {
    [key: string]: string
  }
} => {
  // if refresh is true, refresh revisioned files
  if (refresh !== false) {
    revisionedFiles = getRevFiles()
  }

  // return files
  return revisionedFiles
}
