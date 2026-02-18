import {
    Button,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    Page,
    PageSection,
    PageSectionVariants,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { AppHeaderBare } from "@/ui/component/AppHeader";
import { namespacesPath } from "@/router";

export default function AccessDeniedPage() {
    const navigate = useNavigate();

    return (
        <Page masthead={AppHeaderBare()}>
            <PageSection variant={PageSectionVariants.default} isFilled>
                <EmptyState titleText="404: Not Found" headingLevel="h4" icon={CubesIcon} >
                    <EmptyStateBody>
                        The page you are seeking for not exists.
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
