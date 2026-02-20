import {
    Page,
    PageSidebar,
    PageSidebarBody,
    PageSection,
    PageSectionVariants,
    Nav,
    NavItem,
    NavList,
    NavExpandable,
} from "@patternfly/react-core";
import { useState } from "react";
import { NavLink, Outlet, useRouteLoaderData } from "react-router-dom";
import { AppHeaderWithSidebar } from "@/ui/component/AppHeader";
import "@/ui/layouts.css";
import namespacesSvg from "/namespaces.svg"
import namespaceSvg from "/namespace.svg"
import applicationSvg from "/application.svg"
import {
    namespacesPath,
    buildNamespacePath,
    namespaceSettingsSubpath,
    namespaceAdminsSubpath,
    applicationCreateSubpath,
    applicationsSearchSubpath
} from "@/router"
import type { NamespaceDto } from "@/api/generated/core";


export default function AppLayout() {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const { globalAccess, namespace } = useRouteLoaderData("namespace-layout") as { globalAccess: boolean, namespace: NamespaceDto };

    const masthead = (
        <AppHeaderWithSidebar
            isNavOpen={isNavOpen}
            onToggleNav={() => setIsNavOpen(v => !v)}
        />
    );

    const sidebar = (
        <PageSidebar isSidebarOpen={isNavOpen} className="app-sidebar">
            <PageSidebarBody>
                <Nav aria-label="Global">
                    <NavList>
                        {globalAccess ?
                            <NavExpandable
                                title={
                                    <span className="center-title">
                                        <img src={namespacesSvg} className="icon" />
                                        <span>Global scope</span>
                                    </span>
                                }
                            >
                                <NavItem>
                                    <NavLink end to={namespacesPath}>
                                        Open global control panel
                                    </NavLink>
                                </NavItem>
                            </NavExpandable> : ""
                        }
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={namespaceSvg} className="icon" />
                                    <span>{namespace.name}</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={buildNamespacePath(namespace.id) + namespaceSettingsSubpath}>
                                    Namespace settings
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={buildNamespacePath(namespace.id) + namespaceAdminsSubpath}>
                                    Namespace admins
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={applicationSvg} className="icon" />
                                    <span>Applications</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={buildNamespacePath(namespace.id) + applicationsSearchSubpath}>
                                    Search applications
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={buildNamespacePath(namespace.id) + applicationCreateSubpath}>
                                    Create application
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                    </NavList>
                </Nav>
            </PageSidebarBody>
        </PageSidebar>
    );

    return (
        <Page masthead={masthead} sidebar={sidebar} isManagedSidebar>
            <PageSection variant={PageSectionVariants.default} isFilled className="app-contentSection">
                <Outlet />
            </PageSection>
        </Page>
    );
}
