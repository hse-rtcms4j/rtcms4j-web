import {
    Page,
    PageSection,
    PageSectionVariants,
} from "@patternfly/react-core";
import { AppHeaderBare } from "@/ui/component/AppHeader";

export default function AccessDenied() {
    return (
        <Page masthead={AppHeaderBare()}>
            <PageSection variant={PageSectionVariants.default} isFilled>
                Not Found!
            </PageSection>
        </Page>
    );
}
