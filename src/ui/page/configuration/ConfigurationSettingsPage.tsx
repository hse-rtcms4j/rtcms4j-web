import {
    Card,
    CardBody,
    CardTitle,
    Flex,
    FlexItem,
    Tab,
    Tabs,
    TabTitleText,
} from "@patternfly/react-core";
import { useRouteLoaderData, } from "react-router-dom";
import { useState } from "react";
import type { ApplicationDto, ConfigurationDto, NamespaceDto } from "@/api/generated";
import ConfigurationAppearanceTab from "./ConfigurationAppearanceTab";


export default function NamespaceSettingsPage() {
    const { configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDto };

    const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Configuration {configuration.name} managing</CardTitle>
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

                    </Tab>
                    <Tab eventKey={2} title={<TabTitleText>Commit values</TabTitleText>}>

                    </Tab>
                </Tabs>
            </FlexItem>
        </Flex>
    )
}
