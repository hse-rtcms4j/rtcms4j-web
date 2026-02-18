
# ApplicationDto


## Properties

Name | Type
------------ | -------------
`id` | number
`namespaceId` | number
`name` | string
`description` | string
`creationByService` | boolean

## Example

```typescript
import type { ApplicationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "namespaceId": null,
  "name": null,
  "description": null,
  "creationByService": null,
} satisfies ApplicationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


