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
import { NavLink, Outlet } from "react-router-dom";
import { AppHeaderWithSidebar } from "@/ui/component/AppHeader";
import "@/ui/layouts.css";
import namespacesSvg from "/namespaces.svg"
import gearSvg from "/gear.svg"
import { namespacesPath, namespaceCreateSubpath, namespacesSearchSubpath, systemSubpath } from "@/router"


export default function AppLayout() {
    const [isNavOpen, setIsNavOpen] = useState(true);

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
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={namespacesSvg} className="icon" />
                                    <span>Namespaces</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={namespacesPath + namespacesSearchSubpath}>
                                    Search namespaces
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink end to={namespacesPath + namespaceCreateSubpath}>
                                    Create namespace
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                        <NavExpandable
                            title={
                                <span className="center-title">
                                    <img src={gearSvg} className="icon" />
                                    <span>System</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink end to={namespacesPath + systemSubpath}>
                                    Web UI
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
