import {
    Card,
    CardBody,
    CardTitle
} from "@patternfly/react-core";
import { useRouteLoaderData } from "react-router-dom";
import type { ApplicationDto, ConfigurationDetailedDto, NamespaceDto } from "@/api/generated/core";


export default function NamespaceGreetingPage() {
    const { configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    return (
        <Card ouiaId="BasicCard">
            <CardTitle>You are visiting configuration {configuration.name} control panel.</CardTitle>
            <CardBody>Select any action on the left bar.</CardBody>
        </Card>
    )
}
