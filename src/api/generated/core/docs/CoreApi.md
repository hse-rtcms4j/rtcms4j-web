# CoreApi

All URIs are relative to */api/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addApplicationManager**](CoreApi.md#addapplicationmanager) | **POST** /namespace/{nid}/application/{aid}/manager/{uid} | Add namespace application manager |
| [**addNamespaceAdmin**](CoreApi.md#addnamespaceadmin) | **POST** /namespace/{nid}/admin/{uid} | Add namespace admin |
| [**applyConfigurationCommit**](CoreApi.md#applyconfigurationcommit) | **PATCH** /namespace/{nid}/application/{aid}/configuration/{cid}/commit/{ctid} | Apply namespace application configuration commit |
| [**commitConfiguration**](CoreApi.md#commitconfiguration) | **POST** /namespace/{nid}/application/{aid}/configuration/{cid}/commit | Commit namespace application configuration |
| [**createApplication**](CoreApi.md#createapplication) | **POST** /namespace/{nid}/application | Create new namespace application |
| [**createConfiguration**](CoreApi.md#createconfiguration) | **POST** /namespace/{nid}/application/{aid}/configuration | Create new namespace application configuration |
| [**createNamespace**](CoreApi.md#createnamespace) | **POST** /namespace | Create new namespace |
| [**deleteApplication**](CoreApi.md#deleteapplication) | **DELETE** /namespace/{nid}/application/{aid} | Delete namespace application |
| [**deleteConfiguration**](CoreApi.md#deleteconfiguration) | **DELETE** /namespace/{nid}/application/{aid}/configuration/{cid} | Delete namespace application configuration |
| [**deleteConfigurationCommit**](CoreApi.md#deleteconfigurationcommit) | **DELETE** /namespace/{nid}/application/{aid}/configuration/{cid}/commit/{ctid} | Delete namespace application configuration commit |
| [**deleteNamespace**](CoreApi.md#deletenamespace) | **DELETE** /namespace/{nid} | Delete namespace |
| [**findAllApplications**](CoreApi.md#findallapplications) | **GET** /namespace/{nid}/application | Get all namespace applications |
| [**findAllConfigurations**](CoreApi.md#findallconfigurations) | **GET** /namespace/{nid}/application/{aid}/configuration | Get namespace application configurations |
| [**findAllNamespaces**](CoreApi.md#findallnamespaces) | **GET** /namespace | Get all namespaces |
| [**findAvailableApplications**](CoreApi.md#findavailableapplications) | **GET** /available/applications | Find available  applications |
| [**findAvailableNamespaces**](CoreApi.md#findavailablenamespaces) | **GET** /available/namespaces | Find available namespaces |
| [**getApplication**](CoreApi.md#getapplication) | **GET** /namespace/{nid}/application/{aid} | Get namespace application |
| [**getApplicationClient**](CoreApi.md#getapplicationclient) | **GET** /namespace/{nid}/application/{aid}/client | Get namespace application client |
| [**getApplicationManagers**](CoreApi.md#getapplicationmanagers) | **GET** /namespace/{nid}/application/{aid}/manager | Get namespace application managers |
| [**getConfiguration**](CoreApi.md#getconfiguration) | **GET** /namespace/{nid}/application/{aid}/configuration/{cid} | Get namespace application configuration |
| [**getConfigurationCommit**](CoreApi.md#getconfigurationcommit) | **GET** /namespace/{nid}/application/{aid}/configuration/{cid}/commit/{ctid} | Get namespace application configuration commit |
| [**getConfigurationCommits**](CoreApi.md#getconfigurationcommits) | **GET** /namespace/{nid}/application/{aid}/configuration/{cid}/commit | Get namespace application configuration commits |
| [**getNamespace**](CoreApi.md#getnamespace) | **GET** /namespace/{nid} | Get namespace |
| [**getNamespaceAdmins**](CoreApi.md#getnamespaceadmins) | **GET** /namespace/{nid}/admin | Get namespace admins |
| [**hasAccessToAllNamespaces**](CoreApi.md#hasaccesstoallnamespaces) | **HEAD** /namespace | Check access to all namespaces |
| [**hasAccessToApplication**](CoreApi.md#hasaccesstoapplication) | **HEAD** /namespace/{nid}/application/{aid}/configuration | Check access to all configurations under application under namespace |
| [**hasAccessToNamespace**](CoreApi.md#hasaccesstonamespace) | **HEAD** /namespace/{nid}/application | Check access to namespace |
| [**removeApplicationManager**](CoreApi.md#removeapplicationmanager) | **DELETE** /namespace/{nid}/application/{aid}/manager/{uid} | Remove namespace application manager |
| [**removeNamespaceAdmin**](CoreApi.md#removenamespaceadmin) | **DELETE** /namespace/{nid}/admin/{uid} | Remove namespace admin |
| [**rotateApplicationClientPassword**](CoreApi.md#rotateapplicationclientpassword) | **PATCH** /namespace/{nid}/application/{aid}/client | Rotate namespace application client |
| [**updateApplication**](CoreApi.md#updateapplication) | **PUT** /namespace/{nid}/application/{aid} | Update namespace application |
| [**updateConfiguration**](CoreApi.md#updateconfiguration) | **PUT** /namespace/{nid}/application/{aid}/configuration/{cid} | Update namespace application configuration |
| [**updateNamespace**](CoreApi.md#updatenamespace) | **PUT** /namespace/{nid} | Update namespace |



## addApplicationManager

> addApplicationManager(nid, aid, uid)

Add namespace application manager

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { AddApplicationManagerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // string | User id
    uid: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies AddApplicationManagerRequest;

  try {
    const data = await api.addApplicationManager(body);
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
| **uid** | `string` | User id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | User not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## addNamespaceAdmin

> addNamespaceAdmin(nid, uid)

Add namespace admin

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { AddNamespaceAdminRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // string | User id
    uid: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies AddNamespaceAdminRequest;

  try {
    const data = await api.addNamespaceAdmin(body);
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
| **uid** | `string` | User id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | User not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## applyConfigurationCommit

> applyConfigurationCommit(nid, aid, cid, ctid)

Apply namespace application configuration commit

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { ApplyConfigurationCommitRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // number | Commit id
    ctid: 789,
  } satisfies ApplyConfigurationCommitRequest;

  try {
    const data = await api.applyConfigurationCommit(body);
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
| **ctid** | `number` | Commit id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | ConfigurationCommitDetailedDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## commitConfiguration

> ConfigurationCommitDetailedDto commitConfiguration(nid, aid, cid, configurationCommitRequest)

Commit namespace application configuration

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { CommitConfigurationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // ConfigurationCommitRequest
    configurationCommitRequest: ...,
  } satisfies CommitConfigurationRequest;

  try {
    const data = await api.commitConfiguration(body);
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
| **configurationCommitRequest** | [ConfigurationCommitRequest](ConfigurationCommitRequest.md) |  | |

### Return type

[**ConfigurationCommitDetailedDto**](ConfigurationCommitDetailedDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createApplication

> ApplicationDto createApplication(nid, applicationCreateRequest)

Create new namespace application

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { CreateApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // ApplicationCreateRequest
    applicationCreateRequest: ...,
  } satisfies CreateApplicationRequest;

  try {
    const data = await api.createApplication(body);
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
| **applicationCreateRequest** | [ApplicationCreateRequest](ApplicationCreateRequest.md) |  | |

### Return type

[**ApplicationDto**](ApplicationDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createConfiguration

> ConfigurationDetailedDto createConfiguration(nid, aid, configurationDtoCreateRequest)

Create new namespace application configuration

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { CreateConfigurationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // ConfigurationDtoCreateRequest
    configurationDtoCreateRequest: ...,
  } satisfies CreateConfigurationRequest;

  try {
    const data = await api.createConfiguration(body);
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
| **configurationDtoCreateRequest** | [ConfigurationDtoCreateRequest](ConfigurationDtoCreateRequest.md) |  | |

### Return type

[**ConfigurationDetailedDto**](ConfigurationDetailedDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createNamespace

> NamespaceDto createNamespace(namespaceCreateRequest)

Create new namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { CreateNamespaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // NamespaceCreateRequest
    namespaceCreateRequest: ...,
  } satisfies CreateNamespaceRequest;

  try {
    const data = await api.createNamespace(body);
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
| **namespaceCreateRequest** | [NamespaceCreateRequest](NamespaceCreateRequest.md) |  | |

### Return type

[**NamespaceDto**](NamespaceDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteApplication

> deleteApplication(nid, aid)

Delete namespace application

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { DeleteApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies DeleteApplicationRequest;

  try {
    const data = await api.deleteApplication(body);
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

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | ApplicationDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteConfiguration

> deleteConfiguration(nid, aid, cid)

Delete namespace application configuration

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { DeleteConfigurationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
  } satisfies DeleteConfigurationRequest;

  try {
    const data = await api.deleteConfiguration(body);
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

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | ConfigurationDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteConfigurationCommit

> deleteConfigurationCommit(nid, aid, cid, ctid)

Delete namespace application configuration commit

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { DeleteConfigurationCommitRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // number | Commit id
    ctid: 789,
  } satisfies DeleteConfigurationCommitRequest;

  try {
    const data = await api.deleteConfigurationCommit(body);
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
| **ctid** | `number` | Commit id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | ConfigurationCommitDetailedDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteNamespace

> deleteNamespace(nid)

Delete namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { DeleteNamespaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
  } satisfies DeleteNamespaceRequest;

  try {
    const data = await api.deleteNamespace(body);
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

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | NamespaceDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findAllApplications

> PagedModelApplicationDto findAllApplications(nid, name, page, size)

Get all namespace applications

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { FindAllApplicationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // string | Search by name param (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies FindAllApplicationsRequest;

  try {
    const data = await api.findAllApplications(body);
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
| **name** | `string` | Search by name param | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelApplicationDto**](PagedModelApplicationDto.md)

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


## findAllConfigurations

> PagedModelConfigurationDto findAllConfigurations(nid, aid, name, page, size)

Get namespace application configurations

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { FindAllConfigurationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // string | Search by name param (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies FindAllConfigurationsRequest;

  try {
    const data = await api.findAllConfigurations(body);
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
| **name** | `string` | Search by name param | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelConfigurationDto**](PagedModelConfigurationDto.md)

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


## findAllNamespaces

> PagedModelNamespaceDto findAllNamespaces(name, page, size)

Get all namespaces

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { FindAllNamespacesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // string | Search by name param (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies FindAllNamespacesRequest;

  try {
    const data = await api.findAllNamespaces(body);
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
| **name** | `string` | Search by name param | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelNamespaceDto**](PagedModelNamespaceDto.md)

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


## findAvailableApplications

> PagedModelApplicationDto findAvailableApplications(name, page, size)

Find available  applications

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { FindAvailableApplicationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // string | Search by name param (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies FindAvailableApplicationsRequest;

  try {
    const data = await api.findAvailableApplications(body);
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
| **name** | `string` | Search by name param | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelApplicationDto**](PagedModelApplicationDto.md)

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


## findAvailableNamespaces

> PagedModelNamespaceDto findAvailableNamespaces(name, page, size)

Find available namespaces

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { FindAvailableNamespacesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // string | Search by name param (optional)
    name: name_example,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies FindAvailableNamespacesRequest;

  try {
    const data = await api.findAvailableNamespaces(body);
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
| **name** | `string` | Search by name param | [Optional] [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelNamespaceDto**](PagedModelNamespaceDto.md)

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


## getApplication

> ApplicationDto getApplication(nid, aid)

Get namespace application

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies GetApplicationRequest;

  try {
    const data = await api.getApplication(body);
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

[**ApplicationDto**](ApplicationDto.md)

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
| **404** | ApplicationDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getApplicationClient

> KeycloakClientDto getApplicationClient(nid, aid)

Get namespace application client

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetApplicationClientRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies GetApplicationClientRequest;

  try {
    const data = await api.getApplicationClient(body);
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

[**KeycloakClientDto**](KeycloakClientDto.md)

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


## getApplicationManagers

> Array&lt;UserRoleDto&gt; getApplicationManagers(nid, aid)

Get namespace application managers

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetApplicationManagersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies GetApplicationManagersRequest;

  try {
    const data = await api.getApplicationManagers(body);
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

[**Array&lt;UserRoleDto&gt;**](UserRoleDto.md)

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


## getConfiguration

> ConfigurationDetailedDto getConfiguration(nid, aid, cid)

Get namespace application configuration

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetConfigurationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
  } satisfies GetConfigurationRequest;

  try {
    const data = await api.getConfiguration(body);
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

[**ConfigurationDetailedDto**](ConfigurationDetailedDto.md)

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
| **404** | ConfigurationDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getConfigurationCommit

> ConfigurationCommitDetailedDto getConfigurationCommit(nid, aid, cid, ctid)

Get namespace application configuration commit

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetConfigurationCommitRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // number | Commit id
    ctid: 789,
  } satisfies GetConfigurationCommitRequest;

  try {
    const data = await api.getConfigurationCommit(body);
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
| **ctid** | `number` | Commit id | [Defaults to `undefined`] |

### Return type

[**ConfigurationCommitDetailedDto**](ConfigurationCommitDetailedDto.md)

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
| **404** | ConfigurationCommitDetailedDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getConfigurationCommits

> PagedModelConfigurationCommitDto getConfigurationCommits(nid, aid, cid, page, size)

Get namespace application configuration commits

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetConfigurationCommitsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // number (optional)
    page: 56,
    // number (optional)
    size: 56,
  } satisfies GetConfigurationCommitsRequest;

  try {
    const data = await api.getConfigurationCommits(body);
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
| **page** | `number` |  | [Optional] [Defaults to `undefined`] |
| **size** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PagedModelConfigurationCommitDto**](PagedModelConfigurationCommitDto.md)

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


## getNamespace

> NamespaceDto getNamespace(nid)

Get namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetNamespaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
  } satisfies GetNamespaceRequest;

  try {
    const data = await api.getNamespace(body);
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

### Return type

[**NamespaceDto**](NamespaceDto.md)

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
| **404** | NamespaceDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getNamespaceAdmins

> Array&lt;UserRoleDto&gt; getNamespaceAdmins(nid)

Get namespace admins

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { GetNamespaceAdminsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
  } satisfies GetNamespaceAdminsRequest;

  try {
    const data = await api.getNamespaceAdmins(body);
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

### Return type

[**Array&lt;UserRoleDto&gt;**](UserRoleDto.md)

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


## hasAccessToAllNamespaces

> hasAccessToAllNamespaces()

Check access to all namespaces

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { HasAccessToAllNamespacesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  try {
    const data = await api.hasAccessToAllNamespaces();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Access granted |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## hasAccessToApplication

> hasAccessToApplication(nid, aid)

Check access to all configurations under application under namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { HasAccessToApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
  } satisfies HasAccessToApplicationRequest;

  try {
    const data = await api.hasAccessToApplication(body);
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

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Access granted |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## hasAccessToNamespace

> hasAccessToNamespace(nid)

Check access to namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { HasAccessToNamespaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
  } satisfies HasAccessToNamespaceRequest;

  try {
    const data = await api.hasAccessToNamespace(body);
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

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Access granted |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## removeApplicationManager

> removeApplicationManager(nid, aid, uid)

Remove namespace application manager

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { RemoveApplicationManagerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // string | User id
    uid: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies RemoveApplicationManagerRequest;

  try {
    const data = await api.removeApplicationManager(body);
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
| **uid** | `string` | User id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | UserInfo not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## removeNamespaceAdmin

> removeNamespaceAdmin(nid, uid)

Remove namespace admin

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { RemoveNamespaceAdminRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // string | User id
    uid: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies RemoveNamespaceAdminRequest;

  try {
    const data = await api.removeNamespaceAdmin(body);
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
| **uid** | `string` | User id | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | UserInfo not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rotateApplicationClientPassword

> KeycloakClientDto rotateApplicationClientPassword(nid, aid, propagate)

Rotate namespace application client

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { RotateApplicationClientPasswordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // boolean | Propagate rotated secret
    propagate: true,
  } satisfies RotateApplicationClientPasswordRequest;

  try {
    const data = await api.rotateApplicationClientPassword(body);
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
| **propagate** | `boolean` | Propagate rotated secret | [Defaults to `undefined`] |

### Return type

[**KeycloakClientDto**](KeycloakClientDto.md)

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


## updateApplication

> ApplicationDto updateApplication(nid, aid, applicationUpdateRequest)

Update namespace application

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { UpdateApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // ApplicationUpdateRequest
    applicationUpdateRequest: ...,
  } satisfies UpdateApplicationRequest;

  try {
    const data = await api.updateApplication(body);
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
| **applicationUpdateRequest** | [ApplicationUpdateRequest](ApplicationUpdateRequest.md) |  | |

### Return type

[**ApplicationDto**](ApplicationDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | ApplicationDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateConfiguration

> ConfigurationDto updateConfiguration(nid, aid, cid, configurationDtoUpdateRequest)

Update namespace application configuration

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { UpdateConfigurationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // number | Application id
    aid: 789,
    // number | Configuration id
    cid: 789,
    // ConfigurationDtoUpdateRequest
    configurationDtoUpdateRequest: ...,
  } satisfies UpdateConfigurationRequest;

  try {
    const data = await api.updateConfiguration(body);
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
| **configurationDtoUpdateRequest** | [ConfigurationDtoUpdateRequest](ConfigurationDtoUpdateRequest.md) |  | |

### Return type

[**ConfigurationDto**](ConfigurationDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
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


## updateNamespace

> NamespaceDto updateNamespace(nid, namespaceUpdateRequest)

Update namespace

### Example

```ts
import {
  Configuration,
  CoreApi,
} from '';
import type { UpdateNamespaceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CoreApi(config);

  const body = {
    // number | Namespace id
    nid: 789,
    // NamespaceUpdateRequest
    namespaceUpdateRequest: ...,
  } satisfies UpdateNamespaceRequest;

  try {
    const data = await api.updateNamespace(body);
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
| **namespaceUpdateRequest** | [NamespaceUpdateRequest](NamespaceUpdateRequest.md) |  | |

### Return type

[**NamespaceDto**](NamespaceDto.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful operation |  -  |
| **400** | Wrong or unexpected |  -  |
| **401** | Wrong token or authorization failed |  -  |
| **403** | Not enough permissions to access |  -  |
| **404** | NamespaceDto not found |  -  |
| **405** | Wrong method |  -  |
| **500** | Error on server side |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

