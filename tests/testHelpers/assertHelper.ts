import { Assert } from '@japa/assert'

export const compareValues = (assert: Assert, actual: any, expected: any) => {
  assert.equal(typeof actual, typeof expected)
  switch (typeof actual) {
    case 'string':
    case 'number':
      assert.equal(actual, expected)
      break
    case 'object':
      if (Array.isArray(actual)) {
        assert.equal(actual.length, expected.length)
        actual.forEach((item, index) => {
          assert.equal(item, expected[index])
        })
      } else {
        Object.keys(expected).forEach((key: string) => {
          compareValues(assert, actual[key], expected[key])
        })
        break
      }
  }
}
