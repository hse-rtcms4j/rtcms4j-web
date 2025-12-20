import { Configuration, CoreApi } from './generated'
import { keycloak } from "../auth/keycloak";

const config = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    accessToken: () => keycloak.token ?? "",
    })

export const coreApi = new CoreApi(config)
