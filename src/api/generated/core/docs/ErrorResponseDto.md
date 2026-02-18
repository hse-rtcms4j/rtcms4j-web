
# ErrorResponseDto


## Properties

Name | Type
------------ | -------------
`httpCode` | number
`httpStatus` | string
`detailCode` | number
`detailMessage` | string

## Example

```typescript
import type { ErrorResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "httpCode": null,
  "httpStatus": null,
  "detailCode": null,
  "detailMessage": null,
} satisfies ErrorResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ErrorResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


