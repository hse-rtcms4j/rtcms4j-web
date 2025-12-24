import {
    Card,
    CardBody,
    CardTitle
} from "@patternfly/react-core";
import { useRouteLoaderData } from "react-router-dom";
import type { NamespaceDto } from "@/api/generated";


export default function NamespaceGreetingPage() {
    const { namespace } = useRouteLoaderData("namespace-layout") as { namespace: NamespaceDto };

    return (
        <Card ouiaId="BasicCard">
            <CardTitle>You are visiting namespace {namespace?.name} control panel.</CardTitle>
            <CardBody>Select any action on the left bar.</CardBody>
        </Card>
    )
}
