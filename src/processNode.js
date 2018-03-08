
import { uid, asArray } from './utils'

export function processClone (original, clone) {
  // eslint-disable-next-line
  if (!(clone instanceof Element)) return clone

  return Promise.resolve()
    .then(cloneStyle)
    .then(clonePseudoElements)
    .then(function () {
      return clone
    })

  function cloneStyle () {
    copyStyle(window.getComputedStyle(original), clone.style)

    function copyStyle (source, target) {
      if (source.cssText) {
        target.cssText = source.cssText
      } else {
        copyProperties(source, target)
      }

      function copyProperties (source, target) {
        asArray(source).forEach(function (name) {
          target.setProperty(
            name,
            source.getPropertyValue(name),
            source.getPropertyPriority(name)
          )
        })
      }
    }
  }

  function clonePseudoElements () {
    [':before', ':after'].forEach(function (element) {
      clonePseudoElement(element)
    })

    function clonePseudoElement (element) {
      var style = window.getComputedStyle(original, element)
      var content = style.getPropertyValue('content')

      if (content === '' || content === 'none') return

      var className = uid()
      clone.className = clone.className + ' ' + className

      var styleElement = document.createElement('style')
      styleElement.appendChild(formatPseduElementStyle(className, element, style))
      clone.appendChild(styleElement)

      function formatPseduElementStyle (className, element, style) {
        var selector = '.' + className + ':' + element
        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style)
        return document.createTextNode(selector + '{' + cssText + '}')

        function formatCssText (style) {
          var content = style.getPropertyValue('content')
          return style.cssText + ' content:' + content + ';'
        }

        function formatCssProperties (style) {
          return asArray(style)
            .map(formatProperty)
            .join('; ') + ';'

          function formatProperty (name) {
            return name + ': ' +
               style.getPropertyValue(name) +
               (style.getPropertyPriority(name) ? ' !important' : '')
          }
        }
      }
    }
  }
}
