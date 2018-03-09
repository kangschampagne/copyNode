import cloneNode from './cloneNode'
import embedFonts from './embedFonts'

function copyNode (node, options = {}) {
  return Promise.resolve(node)
    .then(node => {
      return cloneNode(node, options.filter)
    })
    .then(embedFonts)
}

module.exports = copyNode
