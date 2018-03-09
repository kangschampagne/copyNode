import { asArray } from './utils'
import newInliner from './inline'

const fontFaces = newFontFace()
const inliner = newInliner()

function newFontFace () {
  return {
    resolveAll
  }

  function resolveAll () {
    return readAll(document)
      .then(webFonts => {
        return Promise.all(
          webFonts.map(webFont => {
            return webFont.resolve()
          })
        )
      })
      .then(cssStrings => {
        return cssStrings.join('\n')
      })
  }

  function readAll () {
    return Promise.resolve(asArray(document.styleSheets))
      .then(getCssRules)
      .then(selectWebFontRules)
      .then(rules => {
        return rules.map(newWebFont)
      })

    function getCssRules (styleSheets) {
      var cssRules = []
      styleSheets.forEach(function (sheet) {
        try {
          asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules))
        } catch (error) {
          console.log('error while reading CSS rules from ' + sheet.href, error.toString())
        }
      })
      return cssRules
    }

    function selectWebFontRules (cssRules) {
      return cssRules
        .filter(rule => {
          // eslint-disable-next-line
          return rule.type === CSSRule.FONT_FACE_RULE
        })
        .filter(rule => {
          var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g
          return rule.style.getPropertyValue('src').search(URL_REGEX) !== -1
        })
    }

    function newWebFont (webFontRule) {
      return {
        resolve: function resolve () {
          var baseUrl = (webFontRule.parentStyleSheet || {}).href
          return inliner.inlineAll(webFontRule.cssText, baseUrl)
        },
        src: function () {
          return webFontRule.style.getPropertyValue('src')
        }
      }
    }
  }
}

function embedFonts (node) {
  return fontFaces.resolveAll()
    .then(function (cssText) {
      var styleNode = document.createElement('style')
      node.appendChild(styleNode)
      styleNode.appendChild(document.createTextNode(cssText))
      return node
    })
}

export default embedFonts
