import {
    Card,
    CardBody,
    CardTitle,
    Flex,
    FlexItem,
} from "@patternfly/react-core";

export default function NamespacesGreetingPage() {
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Web UI</CardTitle>
                    <CardBody>Realtime Configuration Management System for Java - web control panel stats</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Version</CardTitle>
                    <CardBody>{import.meta.env.VITE_APP_VERSION}</CardBody>
                </Card>
            </FlexItem>
        </Flex>
    )
}
