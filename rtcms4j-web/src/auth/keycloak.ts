import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    })

export async function ensureFreshToken(minValiditySeconds = 30) {
  if (!keycloak.authenticated) return;
  await keycloak.updateToken(minValiditySeconds);
}
