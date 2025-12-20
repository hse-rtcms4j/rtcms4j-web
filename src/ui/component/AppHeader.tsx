import {
    Brand,
    Masthead,
    MastheadBrand,
    MastheadContent,
    MastheadMain,
    MastheadToggle,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
    PageToggleButton,
} from "@patternfly/react-core";
import UserMenuToggle from "@/ui/component/UserMenuToggle";
import "@/ui/component/AppHeader.css"


type AppHeaderProps = {
    isNavOpen: boolean;
    onToggleNav: () => void;
};


function AppHeader(mastheadToggle?: React.ReactNode) {
    return (
        <Masthead className="app-masthead">
            <MastheadMain>
                {mastheadToggle}

                <MastheadBrand className="app-masthead-brand">
                    <Brand src="/rtcms4j_logo.png" alt="rtcms4j logo" style={{ height: 28 }} />
                    <div className="app-brandtext">
                        <div className="app-masthead-brandtext-title">RTCMS4J</div>
                        <div className="app-masthead-brandtext-subtitle">Web control panel</div>
                    </div>
                </MastheadBrand>
            </MastheadMain>

            <MastheadContent>
                <Toolbar isFullHeight>
                    <ToolbarContent>
                        <ToolbarItem align={{ default: "alignEnd" }}>
                            <UserMenuToggle />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </MastheadContent>
        </Masthead>
    );
}

export function AppHeaderWithSidebar({ isNavOpen, onToggleNav }: AppHeaderProps) {
    return AppHeader(
        <MastheadToggle>
            <PageToggleButton className="app-masthead-toggle"
                isHamburgerButton
                aria-label={isNavOpen ? "Collapse" : "Expand"}
                isSidebarOpen={isNavOpen}
                onSidebarToggle={onToggleNav}
            />
        </MastheadToggle>
    );
}

export function AppHeaderBare() {
    return AppHeader();
}
