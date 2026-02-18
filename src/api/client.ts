import { Configuration as CoreConfiguration, CoreApi } from '@/api/generated/core'
import { Configuration as NotifyConfiguration, NotifyApi } from '@/api/generated/notify'
import createKeycloakFetch from '@/api/keycloak-hook'
import { keycloak } from '@/auth/keycloak'

await keycloak.init({
    onLoad: "login-required",
});

const coreConfig = new CoreConfiguration({
    basePath: import.meta.env.VITE_CORE_API_BASE_URL,
    fetchApi: createKeycloakFetch(keycloak),
});
export const coreApi = new CoreApi(coreConfig);

const notifyConfig = new NotifyConfiguration({
    basePath: import.meta.env.VITE_NOTIFY_API_BASE_URL,
    fetchApi: fetch,
});
export const notifyApi = new NotifyApi(notifyConfig);
