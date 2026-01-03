Start app:
```shell
npm run dev
```

Generate openapi client:
```shell
npx @openapitools/openapi-generator-cli generate -i .\core-api.yaml -g typescript-fetch -o src/api/generated
```
