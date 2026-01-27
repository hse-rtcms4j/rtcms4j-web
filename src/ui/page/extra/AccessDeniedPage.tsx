import {
    Page,
    PageSection,
    PageSectionVariants,
    EmptyStateBody,
    EmptyState,
    EmptyStateFooter,
    Button,
    EmptyStateActions,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
import LockIcon from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import { AppHeaderBare } from "@/ui/component/AppHeader";
import { namespacesPath } from "@/router";

export default function AccessDeniedPage() {
    const navigate = useNavigate();

    return (
        <Page masthead={AppHeaderBare()}>
            <PageSection variant={PageSectionVariants.default} isFilled>
                <EmptyState titleText="401: Access Denied" headingLevel="h4" icon={LockIcon} >
                    <EmptyStateBody>
                        You do not have permissions to access this page.
                    </EmptyStateBody>
                    <EmptyStateFooter>
                        <EmptyStateActions>
                            <Button variant="primary" onClick={() => navigate(namespacesPath)}>Visit main page</Button>
                        </EmptyStateActions>
                    </EmptyStateFooter>
                </EmptyState>
            </PageSection>
        </Page>
    );
}
