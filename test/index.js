
var parser = require('./../src/index.js').bind({
  cacheable: () => {}
})

it('should parse a simple module', () => {

  var result = parser(`
    foo: /item/description
    bar: /bar/prop
    ---
    .foo
      h1 {{ foo }}
      p {{ bar }}
 `)

  result = result.replace(/\s/g, '')

  var module = `
  module.exports = {
    args: {"foo":"/item/description","bar":"/bar/prop"},
    template: \`<div className="foo"><h1>{{ foo }}</h1><p>{{ bar }}</p></div>\`
  }
`
  module = module.replace(/\s/g, '')

  expect(result).toBe(module)
})
