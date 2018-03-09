import {
  isDataUrl,
  resolveUrl,
  getAndEncode,
  dataAsUrl,
  mimeType,
  escape
} from './utils'

function newInliner () {
  var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g

  return {
    inlineAll: inlineAll,
    shouldProcess: shouldProcess
  }

  function shouldProcess (string) {
    return string.search(URL_REGEX) !== -1
  }

  function readUrls (string) {
    var result = []
    var match
    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1])
    }
    return result.filter(function (url) {
      return !isDataUrl(url)
    })
  }

  function inline (string, url, baseUrl, get) {
    return Promise.resolve(url)
      .then(function (url) {
        return baseUrl ? resolveUrl(url, baseUrl) : url
      })
      .then(get || getAndEncode)
      .then(function (data) {
        return dataAsUrl(data, mimeType(url))
      })
      .then(function (dataUrl) {
        return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3')
      })

    function urlAsRegex (url) {
      return new RegExp('(url\\([\'"]?)(' + escape(url) + ')([\'"]?\\))', 'g')
    }
  }

  function inlineAll (string, baseUrl, get) {
    if (nothingToInline()) return Promise.resolve(string)

    return Promise.resolve(string)
      .then(readUrls)
      .then(function (urls) {
        var done = Promise.resolve(string)
        urls.forEach(function (url) {
          done = done.then(function (string) {
            return inline(string, url, baseUrl, get)
          })
        })
        return done
      })

    function nothingToInline () {
      return !shouldProcess(string)
    }
  }
}

export default newInliner
