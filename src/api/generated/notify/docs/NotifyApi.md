# NotifyApi

All URIs are relative to */api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getApplicationFeedback**](NotifyApi.md#getapplicationfeedback) | **GET** /namespace/{nid}/application/{aid}/feedback | Get application-level feedback |
| [**getConfigurationFeedback**](NotifyApi.md#getconfigurationfeedback) | **GET** /namespace/{nid}/application/{aid}/configuration/{cid}/feedback | Get configuration-level feedback |
| [**postApplicationFeedback**](NotifyApi.md#postapplicationfeedback) | **POST** /namespace/{nid}/application/{aid}/feedback | Post application-level feedback |
| [**postConfigurationFeedback**](NotifyApi.md#postconfigurationfeedback) | **POST** /namespace/{nid}/application/{aid}/configuration/{cid}/feedback | Post configuration-level feedback |
| [**subscribeOnNotificationSse**](NotifyApi.md#subscribeonnotificationsse) | **GET** /namespace/{nid}/application/{aid}/sse-stream | SSE notifications endpoint |



## getApplicationFeedback

> ApplicationFeedbackResponseDto getApplicationFeedback(nid, aid)

Get application-level feedback

### Example

```ts
import {
  Configuration,
  NotifyApi,
} from '';
import type { GetApplicationFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new NotifyApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies GetApplicationFeedbackRequest;

  try {
    const data = await api.getApplicationFeedback(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nid** | `number` | Namespace id | [Defaults to `undefined`] |
| **aid** | `number` | Application id | [Defaults to `undefined`] |

### Return type

[**ApplicationFeedbackResponseDto**](ApplicationFeedbackResponseDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getConfigurationFeedback

> ConfigurationFeedbackResponseDto getConfigurationFeedback(nid, aid, cid)

Get configuration-level feedback

### Example

```ts
import {
  Configuration,
  NotifyApi,
} from '';
import type { GetConfigurationFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new NotifyApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
  } satisfies GetConfigurationFeedbackRequest;

  try {
    const data = await api.getConfigurationFeedback(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nid** | `number` | Namespace id | [Defaults to `undefined`] |
| **aid** | `number` | Application id | [Defaults to `undefined`] |
| **cid** | `number` | Configuration id | [Defaults to `undefined`] |

### Return type

[**ConfigurationFeedbackResponseDto**](ConfigurationFeedbackResponseDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## postApplicationFeedback

> postApplicationFeedback(nid, aid, applicationFeedbackRequestDto)

Post application-level feedback

### Example

```ts
import {
  Configuration,
  NotifyApi,
} from '';
import type { PostApplicationFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new NotifyApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // ApplicationFeedbackRequestDto
    applicationFeedbackRequestDto: ...,
  } satisfies PostApplicationFeedbackRequest;

  try {
    const data = await api.postApplicationFeedback(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nid** | `number` | Namespace id | [Defaults to `undefined`] |
| **aid** | `number` | Application id | [Defaults to `undefined`] |
| **applicationFeedbackRequestDto** | [ApplicationFeedbackRequestDto](ApplicationFeedbackRequestDto.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successfully posted |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## postConfigurationFeedback

> postConfigurationFeedback(nid, aid, cid, configurationFeedbackRequestDto)

Post configuration-level feedback

### Example

```ts
import {
  Configuration,
  NotifyApi,
} from '';
import type { PostConfigurationFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new NotifyApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // ConfigurationFeedbackRequestDto
    configurationFeedbackRequestDto: ...,
  } satisfies PostConfigurationFeedbackRequest;

  try {
    const data = await api.postConfigurationFeedback(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nid** | `number` | Namespace id | [Defaults to `undefined`] |
| **aid** | `number` | Application id | [Defaults to `undefined`] |
| **cid** | `number` | Configuration id | [Defaults to `undefined`] |
| **configurationFeedbackRequestDto** | [ConfigurationFeedbackRequestDto](ConfigurationFeedbackRequestDto.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successfully posted |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscribeOnNotificationSse

> Array&lt;NotificationEventDto&gt; subscribeOnNotificationSse(nid, aid)

SSE notifications endpoint

### Example

```ts
import {
  Configuration,
  NotifyApi,
} from '';
import type { SubscribeOnNotificationSseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new NotifyApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies SubscribeOnNotificationSseRequest;

  try {
    const data = await api.subscribeOnNotificationSse(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **nid** | `number` | Namespace id | [Defaults to `undefined`] |
| **aid** | `number` | Application id | [Defaults to `undefined`] |

### Return type

[**Array&lt;NotificationEventDto&gt;**](NotificationEventDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/event-stream`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully connected to event stream |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

