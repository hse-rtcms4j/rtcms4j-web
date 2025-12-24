import { useRouteError } from "react-router-dom";
import NotFound from "@/ui/util/NotFound";
import AccessDenied from "@/ui/util/AccessDenied";
import NetworkError from "@/ui/util/NetworkError";
import UnknownError from "@/ui/util/UnknownError";
import { AppRouteError } from "@/ui/util/routes-loader";


export default function ErrorsPage() {
    const unknownError = useRouteError();

    if (unknownError instanceof AppRouteError) {
        const parsedError = unknownError.parsed;

        if (parsedError.kind == "http") {
            if (parsedError.status === 401 || parsedError.status === 403) {
                return <AccessDenied />;
            }
            if (parsedError.status === 404) {
                return <NotFound />;
            }
        } else if (parsedError.kind == "network") {
            return <NetworkError />;
        }
    }
    console.log(unknownError);
    return <UnknownError />;
}
