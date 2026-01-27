import { useRouteError } from "react-router-dom";
import NotFoundPage from "@/ui/page/extra/NotFoundPage";
import AccessDeniedPage from "@/ui/page/extra/AccessDeniedPage";
import NetworkErrorPage from "@/ui/page/extra/NetworkErrorPage";
import UnknownErrorPage from "@/ui/page/extra/UnknownErrorPage";
import { AppRouteError } from "@/ui/util/routes-loader";
import AvailableResourcesPage from "./ui/page/extra/AvailableResourcesPage";


export default function ErrorsPage() {
    const unknownError = useRouteError();

    if (unknownError instanceof AppRouteError) {
        const parsedError = unknownError.parsed;

        if (parsedError.kind == "http") {
            if (parsedError.status === 401 || parsedError.status === 403) {
                if (unknownError.pathname == '/') {
                    return <AvailableResourcesPage />
                }
                return <AccessDeniedPage />;
            }
            if (parsedError.status === 404) {
                return <NotFoundPage />;
            }
        } else if (parsedError.kind == "network") {
            return <NetworkErrorPage />;
        }
    }

    console.log(unknownError);
    return <UnknownErrorPage />;
}
