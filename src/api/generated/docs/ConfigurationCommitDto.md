
# ConfigurationCommitDto


## Properties

Name | Type
------------ | -------------
`namespaceId` | number
`applicationId` | number
`configurationId` | number
`commitId` | number
`sourceType` | [SourceType](SourceType.md)
`sourceIdentity` | string

## Example

```typescript
import type { ConfigurationCommitDto } from ''

// TODO: Update the object below with actual values
const example = {
  "namespaceId": null,
  "applicationId": null,
  "configurationId": null,
  "commitId": null,
  "sourceType": null,
  "sourceIdentity": null,
} satisfies ConfigurationCommitDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConfigurationCommitDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


