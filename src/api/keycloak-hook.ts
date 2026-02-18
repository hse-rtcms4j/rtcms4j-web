import type Keycloak from "keycloak-js";

export default function createKeycloakFetch(keycloak: Keycloak): typeof fetch {
    let refreshPromise: Promise<boolean> | null = null;

    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        if (keycloak.authenticated) {
            if (!refreshPromise) {
                refreshPromise = keycloak.updateToken(30).finally(() => {
                    refreshPromise = null;
                });
            }
            await refreshPromise;
        }

        const headers = new Headers(init?.headers);

        if (keycloak.token) {
            headers.set("Authorization", `Bearer ${keycloak.token}`);
        }

        return fetch(input, {
            ...init,
            headers,
        });
    };
}
