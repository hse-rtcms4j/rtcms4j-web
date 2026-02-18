import { Configuration as CoreConfiguration, CoreApi } from '@/api/generated/core'
import { Configuration as NotifyConfiguration, NotifyApi } from '@/api/generated/notify'
import createKeycloakFetch from '@/api/keycloak-hook'
import { keycloak } from '@/auth/keycloak'


await keycloak.init({
    onLoad: "login-required",
});
const fetch = createKeycloakFetch(keycloak);

const coreConfig = new CoreConfiguration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    fetchApi: fetch,
})
export const coreApi = new CoreApi(coreConfig)

const notifyConfig = new NotifyConfiguration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    fetchApi: fetch,
})
export const notifyApi = new NotifyApi(notifyConfig)
