import {
    Card,
    CardBody,
    CardTitle
} from "@patternfly/react-core";
import { useRouteLoaderData } from "react-router-dom";
import type { ApplicationDto, NamespaceDto } from "@/api/generated/core";


export default function NamespaceGreetingPage() {
    const { application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespace: NamespaceDto | undefined, application: ApplicationDto };

    return (
        <Card ouiaId="BasicCard">
            <CardTitle>You are visiting application {application.name} control panel.</CardTitle>
            <CardBody>Select any action on the left bar.</CardBody>
        </Card>
    )
}
