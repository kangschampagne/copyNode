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
