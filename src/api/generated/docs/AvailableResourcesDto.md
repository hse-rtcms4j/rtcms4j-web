
# AvailableResourcesDto


## Properties

Name | Type
------------ | -------------
`namespaces` | [PagedModelNamespaceDto](PagedModelNamespaceDto.md)
`applications` | [PagedModelApplicationDto](PagedModelApplicationDto.md)

## Example

```typescript
import type { AvailableResourcesDto } from ''

// TODO: Update the object below with actual values
const example = {
  "namespaces": null,
  "applications": null,
} satisfies AvailableResourcesDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AvailableResourcesDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


