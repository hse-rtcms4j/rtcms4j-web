import { createBrowserRouter } from "react-router-dom";
import {
    commonLoader,
    namespacesLayoutLoader,
    namespaceLayoutLoader,
    applicationLayoutLoader,
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
// app pages
import ApplicationLayout from "@/ui/ApplicationLayout";
import ApplicationGreetingPage from "@/ui/page/application/ApplicationGreetingPage";
import ApplicationSettingsPage from "@/ui/page/application/ApplicationSettingsPage";
import ApplicationManagersPage from "@/ui/page/application/ApplicationManagersPage";
import ConfigurationsSearchPage from "@/ui/page/application/ConfigurationsSearchPage";
import ConfigurationCreatePage from "@/ui/page/application/ConfigurationCreatePage";

// global pages
export const namespacesPath = "/"
export const namespacesSearchSubpath = "namespaces-search"
export const namespaceCreateSubpath = "namespaces-create"
export const systemSubpath = "system"
// ns pages
export const namespaceIdKey = ":namespaceId";
export const namespacePath = namespacesPath + `namespace/${namespaceIdKey}/`
export function buildNamespacePath(namespaceId: number) {
    return namespacePath.replace(namespaceIdKey, namespaceId.toString());
}
export const namespaceSettingsSubpath = "settings"
export const namespaceAdminsSubpath = "admins"
export const applicationsSearchSubpath = "applications-search"
export const applicationCreateSubpath = "applications-create"
// app pages
export const applicationIdKey = ":applicationId";
export const applicationPath = namespacePath + `application/${applicationIdKey}/`
export function buildApplicationPath(namespaceId: number, applicationId: number) {
    return applicationPath.replace(namespaceIdKey, namespaceId.toString()).replace(applicationIdKey, applicationId.toString());
}
export const applicationSettingsSubpath = "settings"
export const applicationManagersSubpath = "managers"
export const configurationsSearchSubpath = "configurations-search"
export const configurationCreateSubpath = "configurations-create"
// config pages
export const configurationIdKey = ":configurationId";
export const configurationPath = applicationPath + `configuration/${configurationIdKey}/`
export function buildConfigurationPath(namespaceId: number, applicationId: number, configurationId: number) {
    return configurationPath
        .replace(namespaceIdKey, namespaceId.toString())
        .replace(applicationIdKey, applicationId.toString())
        .replace(configurationIdKey, configurationId.toString());
}


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

            {
                id: "application-layout",
                path: applicationPath,
                loader: applicationLayoutLoader,
                element: <ApplicationLayout />,
                children: [
                    { index: true, element: <ApplicationGreetingPage /> },
                    { path: applicationSettingsSubpath, element: <ApplicationSettingsPage /> },
                    { path: applicationManagersSubpath, element: <ApplicationManagersPage /> },
                    { path: configurationsSearchSubpath, element: <ConfigurationsSearchPage /> },
                    { path: configurationCreateSubpath, element: <ConfigurationCreatePage /> },
                ],
                errorElement: <ErrorsPage />
            },

            { path: "*", element: <NotFound /> }
        ]
    }
]);
