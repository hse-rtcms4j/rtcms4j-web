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

        const modifiedInit: RequestInit = { ...init };

        if (init?.body && typeof init.body === 'object' &&
            !(init.body instanceof FormData) &&
            !(init.body instanceof Blob) &&
            !(init.body instanceof ArrayBuffer)) {
            modifiedInit.body = JSON.stringify(init.body);

            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
        }

        if (keycloak.token) {
            headers.set("Authorization", `Bearer ${keycloak.token}`);
        }

        modifiedInit.headers = headers;

        return fetch(input, modifiedInit);
    };
}
