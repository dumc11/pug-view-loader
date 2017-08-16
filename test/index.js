
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

  var sample = `
  module.exports = {
    args: {"foo":"/item/description","bar":"/bar/prop"},
    template: \`<div class="foo"><h1>{{ foo }}</h1><p>{{ bar }}</p></div>\`
  }

`
  sample = sample.replace(/\s/g, '')

  expect(result).toBe(sample)
})

it('should parse a module with props', () => {

  var result = parser(`
    foo: /item/description
    bar: /bar/prop
    ---
    qux bam bar
    ---
    .foo
      h1 {{ foo }}
      p {{ bar }}
      .bam
        span {{ qux }}
        span {{ bam }}
        span {{ bar }}
 `)

  result = result.replace(/\s/g, '')

  var sample = `
  module.exports = {
    args: {"foo":"/item/description","bar":"/bar/prop"},
    props: ["qux","bam","bar"],
    template: \`<div class="foo"><h1>{{ foo }}</h1><p>{{ bar }}</p><div class="bam"><span>{{ qux }}</span><span>{{ bam }}</span><span>{{ bar }}</span></div></div>\`
  }
`
  sample = sample.replace(/\s/g, '')

  expect(result).toBe(sample)
})

it('should parse nested properties', () => {

  var result = parser(`
    items: /items/list
    ---
    .foo
      ul
        li(v-for="item in items")
          h3 {{ item.title }}
 `)

  result = result.replace(/\s/g, '')

  var sample = `
  module.exports = {
    args: {"items":"/items/list"},
    template: \`<div class="foo"><ul><li v-for="item in items"><h3>{{ item.title }}</h3></li></ul></div>\`
  }
`
  sample = sample.replace(/\s/g, '')

  expect(result).toBe(sample)
})


