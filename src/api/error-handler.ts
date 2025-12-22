import { ResponseError, FetchError, RequiredError } from "@/api/generated/runtime";
import type { ErrorResponseDto } from "@/api/generated";


export type ApiErrorKind = "http" | "timeout" | "abort" | "network" | "required" | "unknown";

export type ParsedApiError<ErrorResponseDto = unknown> = {
    kind: ApiErrorKind;
    status?: number;
    url?: string;
    dto?: ErrorResponseDto;
    cause?: unknown;
};

export default async function parseApiFetchError(
    err: unknown
): Promise<ParsedApiError<ErrorResponseDto>> {
    if (err instanceof RequiredError) {
        return { kind: "required", cause: err };
    }

    if (err instanceof ResponseError) {
        const res = err.response;
        const status = res.status;
        const url = res.url;

        try {
            const contentType = res.headers.get("content-type") ?? "";
            if (contentType.includes("application/json")) {
                const dto = (await res.json()) as ErrorResponseDto;
                return { kind: "http", status, url, dto, cause: err };
            }
        } catch (e) { }

        return { kind: "http", status, url, cause: err };
    }

    if (err instanceof FetchError) {
        return { kind: "network", cause: err };
    }

    if (err instanceof DOMException && err.name === "AbortError") {
        return { kind: "abort", cause: err };
    }

    if (typeof err === "object" && err && "name" in err && (err as any).name === "AbortError") {
        return { kind: "abort", cause: err };
    }

    return { kind: "unknown", cause: err };
}
