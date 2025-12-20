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
import "@/ui/NamespacesLayout.css";
import namespacesSvg from "/namespaces.svg"
import gearSvg from "/gear.svg"
import { namespacesPath, namespaceCreateSubpath, namespacesSearchSubpath } from "@/router"

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
                                <span className="nav-expandable-title">
                                    <img src={namespacesSvg} />
                                    <span>Namespaces</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink to={namespacesPath + namespacesSearchSubpath}>
                                   Search namespaces
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to={namespacesPath + namespaceCreateSubpath}>
                                    Create namespace
                                </NavLink>
                            </NavItem>
                        </NavExpandable>
                        <NavExpandable
                            title={
                                <span className="nav-expandable-title">
                                    <img src={gearSvg} />
                                    <span>System</span>
                                </span>
                            }
                        >
                            <NavItem>
                                <NavLink to="/system">
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
