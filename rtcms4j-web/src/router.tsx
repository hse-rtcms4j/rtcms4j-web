import { createBrowserRouter } from "react-router-dom";

import AccessGuard from "@/ui/util/AccessGuard";
import NamespacesLayout from "@/ui/NamespacesLayout";
import NamespacesGreetingPage from "@/ui/page/NamespacesGreetingPage";
import NamespacesSearchPage from "@/ui/page/NamespacesSearchPage";
import NamespaceCreatePage from "@/ui/page/NamespaceCreatePage";
import SystemPage from "@/ui/page/SystemPage";
import { coreApi } from "@/api/client";


function NotFound() {
    return <div style={{ padding: 24 }}>404</div>;
}


export const namespacesPath = "/"
export const namespacesSearchSubpath = "namespaces-search"
export const namespaceCreateSubpath = "namespaces-create"
export const systemSubpath = "system"


export const router = createBrowserRouter([
    {
        path: namespacesPath,
        element: <AccessGuard accessChecker={() => coreApi.hasAccessToAllNamespaces()}><NamespacesLayout /></AccessGuard>,
        children: [
            { index: true, element: <NamespacesGreetingPage /> },
            { path: namespacesSearchSubpath, element: <NamespacesSearchPage /> },
            { path: namespaceCreateSubpath, element: <NamespaceCreatePage /> },
            { path: systemSubpath, element: <SystemPage /> },
        ],
    },
    //   {
    //     path: "/namespace/:namespaceId",
    //     element: <NamespaceLayout />,
    //     children: [
    //       // "/namespace/N" (or "/namespace/N/") -> greeting
    //       { index: true, element: <NamespaceGreetingPage /> },
    //
    //       // "/namespace/N/applications-search" -> apps search
    //       { path: "applications-search", element: <ApplicationsSearchPage /> },
    //
    //       // "/namespace/N/applications-create" -> apps create
    //       { path: "applications-create", element: <ApplicationsCreatePage /> },
    //     ],
    //   },

    { path: "*", element: <NotFound /> },
]);
