
# ApplicationFeedbackDto


## Properties

Name | Type
------------ | -------------
`datedAt` | string
`clientName` | string
`isSecretRotated` | boolean

## Example

```typescript
import type { ApplicationFeedbackDto } from ''

// TODO: Update the object below with actual values
const example = {
  "datedAt": null,
  "clientName": null,
  "isSecretRotated": null,
} satisfies ApplicationFeedbackDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationFeedbackDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


