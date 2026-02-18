import {
    Dropdown,
    MenuToggle,
    DropdownList,
    DropdownItem,
    type MenuToggleElement,
    DropdownGroup,
} from "@patternfly/react-core";
import { useState } from "react";
import { keycloak } from "@/auth/keycloak"
import "@/ui/component/UserMenuToggle.css";
import { useRouteLoaderData } from "react-router-dom";
import type { KeycloakProfile } from "keycloak-js";


export default function UserMenuToggle() {
    const { profile } = useRouteLoaderData("common") as { profile: KeycloakProfile };
    const [isOpen, setIsOpen] = useState(false);

    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} className="app-masthead-usermenu">
                    {profile.username ?? profile.id}
                </MenuToggle>
            )}
            popperProps={{ placement: "bottom-end" }}
        >
            <DropdownGroup label={`Subject: ${profile.id}`} labelHeadingLevel="h3">
                <DropdownList>
                    <DropdownItem value={0} onClick={() => keycloak.logout()}>
                        Logout
                    </DropdownItem>
                </DropdownList>
            </DropdownGroup>
        </Dropdown>
    );
}
