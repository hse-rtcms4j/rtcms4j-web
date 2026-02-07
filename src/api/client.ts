import { Configuration, CoreApi } from '@/api/generated'
import createKeycloakFetch from '@/api/keycloak-hook'
import { keycloak } from '@/auth/keycloak'


await keycloak.init({
    onLoad: "login-required",
});

const config = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL,

    fetchApi: createKeycloakFetch(keycloak),
})

export const coreApi = new CoreApi(config)
