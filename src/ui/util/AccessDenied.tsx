import {
    Card,
    CardTitle,
    CardBody,
    Page,
    PageSection,
    PageSectionVariants,
    CardHeader,
    Brand,
} from "@patternfly/react-core";
import { AppHeaderBare } from "@/ui/component/AppHeader";
import skullSvg from "/skull.svg"

export default function AccessDenied() {
    return (
        <Page masthead={AppHeaderBare()}>
            <PageSection variant={PageSectionVariants.default} isFilled>
                <Card ouiaId="BasicCard" style={{ textAlign: "center" }}>
                    <CardHeader>
                        <Brand src={skullSvg} alt="Skull icon" style={{ height: '5em' }} />
                    </CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardBody>You do not have permissions to access this page.</CardBody>
                </Card>
            </PageSection>
        </Page>
    );
}
