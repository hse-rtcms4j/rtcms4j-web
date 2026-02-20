import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Divider,
    EmptyState,
    Flex,
    FlexItem,
    Spinner,
    Timestamp,
} from "@patternfly/react-core";
import { useRouteLoaderData } from "react-router-dom";
import type { ApplicationDto, NamespaceDto } from "@/api/generated/core";
import SyncIcon from "@patternfly/react-icons/dist/esm/icons/sync-icon";
import { useEffect, useState } from "react";
import { notifyApi } from "@/api/client";
import type { ApplicationFeedbackResponseDto } from "@/api/generated/notify";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

function useApplicationFeedback(namespaceId: number, applicationId: number, refreshKey: number) {
    const [state, setState] = useState<{
        feedback: ApplicationFeedbackResponseDto | undefined;
        loading: boolean;
    }>({ feedback: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const feedback = await notifyApi.getApplicationFeedback({
                    nid: namespaceId,
                    aid: applicationId,
                });
                if (!cancelled) setState({ feedback: feedback, loading: false });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [namespaceId, applicationId, refreshKey]);

    return state;
}


export default function NamespaceGreetingPage() {
    const { namespaceId, application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto };

    const [refreshKey, setRefreshKey] = useState(0);
    const feedbackWrapper = useApplicationFeedback(namespaceId, application.id, refreshKey);

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
                                    onClick={() => setRefreshKey(v => v + 1)}
                                    icon={<SyncIcon />}
                                >Refresh</Button>
                            ]
                        }}
                    >
                        <CardTitle>You are visiting application {application.name} control panel.</CardTitle>
                    </CardHeader>
                    <CardBody>Select any action on the left bar.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Divider />
            </FlexItem>
            <FlexItem>
                {
                    feedbackWrapper?.loading ? (
                        <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner} />
                    ) : feedbackWrapper?.feedback?.content?.length === 0 ? (
                        <EmptyState titleText="No feedback yet..." headingLevel="h4" icon={CubesIcon} />
                    ) : (
                        <Table aria-label="Table">
                            <Thead>
                                <Tr>
                                    <Th>Timestamp</Th>
                                    <Th>Event</Th>
                                    <Th>Program identity</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    feedbackWrapper?.feedback?.content
                                        ?.sort((a, b) => new Date(b.datedAt).getTime() - new Date(a.datedAt).getTime())
                                        ?.map(fb => (
                                            <Tr key={fb.datedAt}>
                                                <Td modifier="fitContent"><Timestamp date={new Date(fb.datedAt)} /></Td>
                                                <Td>{fb.isSecretRotated ? "Password rotated" : "Unknown event"}</Td>
                                                <Td>{fb.clientName}</Td>
                                            </Tr>
                                        )
                                        )
                                }
                            </Tbody>
                        </Table>
                    )
                }
            </FlexItem>
        </Flex>
    )
}
