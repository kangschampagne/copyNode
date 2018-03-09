export const uid = (() => {
  var index = 0
  return function () {
    return 'u' + fourRandomChars() + index++
    function fourRandomChars () {
      return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
    }
  }
})()

export function asArray (arrLike) {
  var array = []
  var len = arrLike.length
  for (let i = 0; i < len; i++) {
    array.push(arrLike[i])
  }
  return array
}

export function isDataUrl (url) {
  return url.search(/^(data:)/) !== -1
}

export function resolveUrl (url, baseUrl) {
  var doc = document.implementation.createHTMLDocument()
  var base = doc.createElement('base')
  doc.head.appendChild(base)
  var a = doc.createElement('a')
  doc.body.appendChild(a)
  base.href = baseUrl
  a.href = url
  return a.href
}

export function getAndEncode (url) {
  var TIMEOUT = 30000

  return new Promise(function (resolve) {
    // eslint-disable-next-line
    var request = new XMLHttpRequest()

    request.onreadystatechange = done
    request.ontimeout = timeout
    request.responseType = 'blob'
    request.timeout = TIMEOUT
    request.open('GET', url, true)
    request.send()

    var placeholder

    function done () {
      if (request.readyState !== 4) return

      if (request.status !== 200) {
        if (placeholder) {
          resolve(placeholder)
        } else {
          fail('cannot fetch resource: ' + url + ', status: ' + request.status)
        }

        return
      }

      // eslint-disable-next-line
      var encoder = new FileReader()

      encoder.onloadend = function () {
        var content = encoder.result.split(/,/)[1]
        resolve(content)
      }
      encoder.readAsDataURL(request.response)
    }

    function timeout () {
      if (placeholder) {
        resolve(placeholder)
      } else {
        fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url)
      }
    }

    function fail (message) {
      console.error(message)
      resolve('')
    }
  })
}

export function dataAsUrl (content, type) {
  return 'data:' + type + ';base64,' + content
}

function mimes () {
  /*
   * Only WOFF and EOT mime types for fonts are 'real'
   * see http://www.iana.org/assignments/media-types/media-types.xhtml
   */
  var WOFF = 'application/font-woff'
  var JPEG = 'image/jpeg'

  return {
    'woff': WOFF,
    'woff2': WOFF,
    'ttf': 'application/font-truetype',
    'eot': 'application/vnd.ms-fontobject',
    'png': 'image/png',
    'jpg': JPEG,
    'jpeg': JPEG,
    'gif': 'image/gif',
    'tiff': 'image/tiff',
    'svg': 'image/svg+xml'
  };
}

function parseExtension (url) {
  var match = /\.([^\.\/]*?)$/g.exec(url)
  if (match) return match[1]
  else return ''
}

export function mimeType (url) {
  var extension = parseExtension(url).toLowerCase()
  return mimes()[extension] || ''
}

export function escape (string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
}
