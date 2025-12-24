import { createBrowserRouter } from "react-router-dom";
import {
    commonLoader,
    namespacesLayoutLoader,
    namespaceLayoutLoader,
    //     applicationLayoutLoader,
    //     configurationLayoutLoader
} from "@/ui/util/routes-loader";
import ErrorsPage from "@/ui/util/ErrorsPage";
import NotFound from "@/ui/util/NotFound";
// global pages
import NamespacesLayout from "@/ui/NamespacesLayout";
import NamespacesGreetingPage from "@/ui/page/global/NamespacesGreetingPage";
import NamespacesSearchPage from "@/ui/page/global/NamespacesSearchPage";
import NamespaceCreatePage from "@/ui/page/global/NamespaceCreatePage";
import SystemPage from "@/ui/page/global/SystemPage";
// ns pages
import NamespaceLayout from "@/ui/NamespaceLayout";
import NamespaceGreetingPage from "@/ui/page/namespace/NamespaceGreetingPage";
import NamespaceSettingsPage from "@/ui/page/namespace/NamespaceSettingsPage";
import NamespaceAdminsPage from "@/ui/page/namespace/NamespaceAdminsPage";
import ApplicationsSearchPage from "@/ui/page/namespace/ApplicationsSearchPage";
import ApplicationCreatePage from "@/ui/page/namespace/ApplicationCreatePage";
// global pages
export const namespacesPath = "/"
export const namespacesSearchSubpath = "namespaces-search"
export const namespaceCreateSubpath = "namespaces-create"
export const systemSubpath = "system"
// ns pages
export const namespaceIdKey = ":namespaceId";
export const namespacePath = namespacesPath + `namespace/${namespaceIdKey}/`
export function buildNamespacePath(namespaceId: number) {
    return namespacePath.replace(namespaceIdKey, namespaceId.toString())
}
export const namespaceSettingsSubpath = "settings"
export const namespaceAdminsSubpath = "admins"
export const applicationsSearchSubpath = "applications-search"
export const applicationCreateSubpath = "applications-create"
// app pages
export const applicationIdKey = ":applicationId";
export const applicationPath = namespacePath + `application/${applicationIdKey}/`
export function buildApplicationPath(namespaceId: number, applicationId: number) {
    return applicationPath.replace(namespaceIdKey, namespaceId.toString()).replace(applicationIdKey, applicationId.toString())
}
// TODO: application pages

export const router = createBrowserRouter([
    {
        id: "common",
        loader: commonLoader,
        children: [
            {
                id: "namespaces-layout",
                path: namespacesPath,
                loader: namespacesLayoutLoader,
                element: <NamespacesLayout />,
                children: [
                    { index: true, element: <NamespacesGreetingPage /> },
                    { path: namespacesSearchSubpath, element: <NamespacesSearchPage /> },
                    { path: namespaceCreateSubpath, element: <NamespaceCreatePage /> },
                    { path: systemSubpath, element: <SystemPage /> },
                ],
                errorElement: <ErrorsPage />
            },

            {
                id: "namespace-layout",
                path: namespacePath,
                loader: namespaceLayoutLoader,
                element: <NamespaceLayout />,
                children: [
                    { index: true, element: <NamespaceGreetingPage /> },
                    { path: namespaceSettingsSubpath, element: <NamespaceSettingsPage /> },
                    { path: namespaceAdminsSubpath, element: <NamespaceAdminsPage /> },
                    { path: applicationsSearchSubpath, element: <ApplicationsSearchPage /> },
                    { path: applicationCreateSubpath, element: <ApplicationCreatePage /> },
                ],
                errorElement: <ErrorsPage />
            },

            { path: "*", element: <NotFound /> }
        ]
    }
]);
