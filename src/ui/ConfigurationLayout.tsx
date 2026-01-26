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
    buildConfigurationPath,
    configurationSettingsSubpath,
    configurationVersionsSubpath
} from "@/router"
import type { ApplicationDto, ConfigurationDto, NamespaceDto } from "@/api/generated/";


export default function AppLayout() {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const { globalAccess, namespaceId, namespace, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDto };

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
                                    <NavLink to={namespacesPath}>
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
                                    <NavLink to={buildNamespacePath(namespace.id)}>
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
                                <NavLink to={buildApplicationPath(namespaceId, application.id)}>
                                    Open application control panel
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={configurationSvg} className="icon" />
                                    <span>{configuration.name}</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink to={buildConfigurationPath(namespaceId, application.id, configuration.id) + configurationSettingsSubpath}>
                                    Settings
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to={buildConfigurationPath(namespaceId, application.id, configuration.id) + configurationVersionsSubpath}>
                                    Versions
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
