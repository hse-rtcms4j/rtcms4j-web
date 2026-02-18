
# NotificationEventDto


## Properties

Name | Type
------------ | -------------
`configurationUpdateEvent` | [ConfigurationUpdateEventDto](ConfigurationUpdateEventDto.md)
`passwordRotationEvent` | [PasswordRotationEventDto](PasswordRotationEventDto.md)

## Example

```typescript
import type { NotificationEventDto } from ''

// TODO: Update the object below with actual values
const example = {
  "configurationUpdateEvent": null,
  "passwordRotationEvent": null,
} satisfies NotificationEventDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NotificationEventDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


