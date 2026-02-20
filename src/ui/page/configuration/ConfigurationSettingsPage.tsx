import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Flex,
    FlexItem,
    Tab,
    Tabs,
    TabTitleText,
} from "@patternfly/react-core";
import { useRevalidator, useRouteLoaderData, } from "react-router-dom";
import { useState } from "react";
import SyncIcon from "@patternfly/react-icons/dist/esm/icons/sync-icon";
import type { ApplicationDto, ConfigurationDto, NamespaceDto } from "@/api/generated/core";
import ConfigurationAppearanceTab from "./ConfigurationAppearanceTab";
import ConfigurationSchemaTab from "./ConfigurationSchemaTab";
import ConfigurationValuesTab from "./ConfigurationValuesTab";


export default function NamespaceSettingsPage() {
    const { configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDto };
    const revalidator = useRevalidator();

    const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardHeader
                        hasWrap
                        actions={{
                            hasNoOffset: true,
                            actions: [
                                <Button
                                    variant="link"
                                    aria-label="Refresh"
                                    onClick={revalidator.revalidate}
                                    icon={<SyncIcon />}
                                >Refresh</Button>
                            ]
                        }}
                    >
                        <CardTitle>Configuration {configuration.name} managing</CardTitle>
                    </CardHeader>
                    <CardBody>A configuration is a fixed state of key-value properties. One program instance can contain multiple configurations and their states.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Tabs
                    activeKey={activeTabKey}
                    onSelect={(_, v) => setActiveTabKey(v)}
                    isBox={true}
                    aria-label="Tabs"
                    role="region"
                >
                    <Tab eventKey={0} title={<TabTitleText>Appearance</TabTitleText>}>
                        <ConfigurationAppearanceTab />
                    </Tab>
                    <Tab eventKey={1} title={<TabTitleText>Commit schema</TabTitleText>}>
                        <ConfigurationSchemaTab />
                    </Tab>
                    <Tab eventKey={2} title={<TabTitleText>Commit values</TabTitleText>}>
                        <ConfigurationValuesTab />
                    </Tab>
                </Tabs>
            </FlexItem>
        </Flex>
    )
}
