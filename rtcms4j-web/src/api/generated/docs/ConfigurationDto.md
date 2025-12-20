
# ConfigurationDto


## Properties

Name | Type
------------ | -------------
`id` | number
`namespaceId` | number
`applicationId` | number
`name` | string
`schemaSourceType` | [SourceType](SourceType.md)
`commitId` | number

## Example

```typescript
import type { ConfigurationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "namespaceId": null,
  "applicationId": null,
  "name": null,
  "schemaSourceType": null,
  "commitId": null,
} satisfies ConfigurationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConfigurationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


