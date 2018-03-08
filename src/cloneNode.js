import { asArray } from './utils'
import { processClone } from './processNode'

function cloneNode (node, filter) {
  return Promise.resolve(node)
    .then(makeNodeCopy)
    .then(clone => {
      return cloneChildren(node, clone, filter)
    })
    .then(clone => {
      return processClone(node, clone)
    })
    .then(clone => {
      return clone
    })

  function makeNodeCopy (node) {
    return node.cloneNode(false)
  }

  function cloneChildren (original, clone, filter) {
    var children = original.childNodes
    if (children.length === 0) return Promise.resolve(clone)

    return cloneChildrenInOrder(clone, asArray(children), filter)
      .then(() => {
        return clone
      })

    function cloneChildrenInOrder (parent, children, filter) {
      var done = Promise.resolve()
      children.forEach(function (child) {
        done = done
          .then(function () {
            return cloneNode(child, filter)
          })
          .then(function (childClone) {
            if (childClone) parent.appendChild(childClone)
          })
      })
      return done
    }
  }
}

async function cloneNode (node, filter) {
  await makeNodeCopy(node)

}

export default cloneNode
