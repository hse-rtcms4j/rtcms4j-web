import {
    Card,
    CardBody,
    CardTitle
} from "@patternfly/react-core";

export default function NamespacesGreetingPage() {
    return (
        <Card ouiaId="BasicCard">
            <CardTitle>You are visiting global scope control panel.</CardTitle>
            <CardBody>Select any action on the left bar.</CardBody>
        </Card>
    )
}
