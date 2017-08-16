
var render = require('pug').render

module.exports = function(content) {
  this.cacheable && this.cacheable();
  this.value = content;

  var splitedRaw = content
    .split('\n')
    .filter(function(str) {
      return str !== '' && str.match(/^\s\t*$/g) === null
    })

  var currentVars = true
  var takeProps = false
  var ignoreNext = false
  var code = splitedRaw.reduce((acc, x, index, arr) => {
    var val = x.replace(/\s/g, '')
    if (val === '---' && currentVars === true) {
      currentVars = false

      // check for props
      let propsLine = arr[index + 2]

      if (propsLine && propsLine.replace(/\s/g, '') === '---') {
        takeProps = true
      }
      return acc
    }

    if (takeProps) {
      acc.props = x
      takeProps = false
      ignoreNext = true
      return acc
    }

    if (ignoreNext) {
      ignoreNext = false
      return acc
    }

    if (currentVars) {
      acc.vars.push(val)
    } else {
      acc.lines.push(x)
    }

    return acc
  }, {
    vars: [],
    props: '',
    lines: []
  })

  var args = code.vars.reduce((acc, x) => {
    x = x.replace(/[\s\t]/g, '')
    let parts = x.split(':')
    acc[parts[0]] = parts[1]
    return acc
  }, {})

  var props
  if (code.props !== '') {
    props = code.props.replace(/^\s+/g, '').split(' ')
  }

  var rootIndent = /^\s*/.exec(code.lines[0])[0]
  var fixedRaw = code.lines.map(function (raw) {
    var spaceRegExp = new RegExp(`^${rootIndent}`)
    return raw.replace(spaceRegExp, '')
  }).join('\n')

  var html = render(fixedRaw)
    .replace(/"\{/g, '{').replace(/\}"/g, '}').replace(/\};"/g, '}')
    .replace(/class="/g, 'className="').replace(/for="/g, 'htmlFor="')
    .replace(/\\\`/g, '`')

  return `
    module.exports = {
      args: ${JSON.stringify(args)},
      ${ props ? 'props: ' + JSON.stringify(props)  + ',' : ''}
      template: \`${html}\`
    }
  `
}