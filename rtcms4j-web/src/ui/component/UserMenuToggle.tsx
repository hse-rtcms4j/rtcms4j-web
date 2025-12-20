import {
    Dropdown,
    MenuToggle,
    DropdownList,
    DropdownItem,
    type MenuToggleElement,
    DropdownGroup,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { keycloak } from "@/auth/keycloak"
import "@/ui/component/UserMenuToggle.css";


function useKeycloakUser() {
    const [state, setState] = useState<{ username?: string; subject: string; loading: boolean }>({
        username: "Loading...",
        subject: "Loading...",
        loading: true
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const profile = await keycloak.loadUserProfile();
                if (!cancelled) setState({
                    username: profile.username,
                    subject: profile.id!!,
                    loading: false
                });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [keycloak]);

    return state;
}


export default function UserMenuToggle() {
    const [isOpen, setIsOpen] = useState(false);

    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };

    const keycloakUser = useKeycloakUser()

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} className="app-masthead-usermenu">
                    {keycloakUser.username ?? keycloakUser.subject}
                </MenuToggle>
            )}
            popperProps={{ placement: "bottom-end" }}
        >
            <DropdownGroup label={`Subject: ${keycloakUser.subject}`} labelHeadingLevel="h3">
                <DropdownList>
                    <DropdownItem value={0} onClick={() => keycloak.logout()}>
                        Logout
                    </DropdownItem>
                </DropdownList>
            </DropdownGroup>
        </Dropdown>
    );
}
