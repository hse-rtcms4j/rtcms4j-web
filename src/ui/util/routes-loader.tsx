import { type LoaderFunctionArgs } from "react-router-dom";
import parseApiFetchError, { type ParsedApiError } from "@/api/error-handler";
import { coreApi } from "@/api/client";
import type { ErrorResponseDto, NamespaceDto } from "@/api/generated";
import { keycloak } from "@/auth/keycloak"

export class AppRouteError extends Error {
    parsed: ParsedApiError<ErrorResponseDto>;

    constructor(parsed: ParsedApiError<ErrorResponseDto>) {
        super("Parsed error wrapper.");
        this.parsed = parsed;
    }
}


export async function commonLoader({ }: LoaderFunctionArgs) {
    const profile = await keycloak.loadUserProfile();

    return { profile };
}


export async function namespacesLayoutLoader({ }: LoaderFunctionArgs) {
    try {
        await coreApi.hasAccessToAllNamespaces();
        return {};
    } catch (unknownError) {
        const parsedError = await parseApiFetchError(unknownError);
        throw new AppRouteError(parsedError);
    }
}


export async function namespaceLayoutLoader({ params }: LoaderFunctionArgs) {
    const namespaceId = Number(params.namespaceId);

    let globalAccess = false;
    try {
        await coreApi.hasAccessToAllNamespaces();
        globalAccess = true;
    } catch (unknownError) { }

    try {
        const namespace = await coreApi.getNamespace({ nid: namespaceId });

        return { globalAccess, namespace };
    } catch (unknownError) {
        const parsedError = await parseApiFetchError(unknownError);
        throw new AppRouteError(parsedError);
    }
}


export async function applicationLayoutLoader({ params }: LoaderFunctionArgs) {
    const namespaceId = Number(params.namespaceId);
    const applicationId = Number(params.applicationId);

    let globalAccess = false;
    try {
        await coreApi.hasAccessToAllNamespaces();
        globalAccess = true;
    } catch (unknownError) { }

    let namespace: NamespaceDto | undefined = undefined;
    try {
        namespace = await coreApi.getNamespace({ nid: namespaceId });
    } catch (unknownError) { }

    try {
        const application = await coreApi.getApplication({ nid: namespaceId, aid: applicationId });

        return { globalAccess, namespaceId, namespace, application };
    } catch (unknownError) {
        const parsedError = await parseApiFetchError(unknownError);
        throw new AppRouteError(parsedError);
    }
}


export async function configurationLayoutLoader({ params }: LoaderFunctionArgs) {
    const namespaceId = Number(params.namespaceId);
    const applicationId = Number(params.applicationId);
    const configurationId = Number(params.configurationId);

    let globalAccess = false;
    try {
        await coreApi.hasAccessToAllNamespaces();
        globalAccess = true;
    } catch (unknownError) { }

    let namespace: NamespaceDto | undefined = undefined;
    try {
        namespace = await coreApi.getNamespace({ nid: namespaceId });
    } catch (unknownError) { }

    try {
        const application = await coreApi.getApplication({ nid: namespaceId, aid: applicationId });
        const configuration = await coreApi.getConfiguration({ nid: namespaceId, aid: applicationId, cid: configurationId });

        return { globalAccess, namespaceId, namespace, application, configuration };
    } catch (unknownError) {
        const parsedError = await parseApiFetchError(unknownError);
        throw new AppRouteError(parsedError);
    }
}
