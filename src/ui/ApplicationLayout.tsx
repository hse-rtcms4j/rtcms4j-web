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
import configurationSvg from "/configuration.svg"
import {
    namespacesPath,
    buildNamespacePath,
    buildApplicationPath,
    applicationSettingsSubpath,
    applicationManagersSubpath,
    configurationsSearchSubpath,
    configurationCreateSubpath
} from "@/router"
import type { ApplicationDto, NamespaceDto } from "@/api/generated/core";


export default function AppLayout() {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const { globalAccess, namespaceId, namespace, application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto };

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
                        {namespace !== undefined ?
                            <NavExpandable
                                title={
                                    <span className="center-title">
                                        <img src={namespaceSvg} className="icon" />
                                        <span>{namespace.name}</span>
                                    </span>
                                }
                            >
                                <NavItem>
                                    <NavLink end to={buildNamespacePath(namespace.id)}>
                                        Open namespace control panel
                                    </NavLink>
                                </NavItem>
                            </NavExpandable> : ""
                        }
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={applicationSvg} className="icon" />
                                    <span>{application.name}</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={buildApplicationPath(namespaceId, application.id)}>
                                    Control panel
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={buildApplicationPath(namespaceId, application.id) + applicationSettingsSubpath}>
                                    Application settings
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={buildApplicationPath(namespaceId, application.id) + applicationManagersSubpath}>
                                    Application managers
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={configurationSvg} className="icon" />
                                    <span>Configurations</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={buildApplicationPath(namespaceId, application.id) + configurationsSearchSubpath}>
                                    Search configurations
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={buildApplicationPath(namespaceId, application.id) + configurationCreateSubpath}>
                                    Create configuration
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
