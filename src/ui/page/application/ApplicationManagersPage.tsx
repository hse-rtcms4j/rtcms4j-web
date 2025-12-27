import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Divider,
    Flex,
    FlexItem,
    TextInputGroup,
    TextInputGroupMain,
} from "@patternfly/react-core";
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    TableText,
} from "@patternfly/react-table";
import { useRouteLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import type { KeycloakProfile } from "keycloak-js";
import type { ApplicationDto, NamespaceDto, UserRoleDto } from "@/api/generated";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";

function useManagers(nid: number, aid: number, refreshKey: number) {
    const [state, setState] = useState<{
        managers: UserRoleDto[] | undefined;
        loading: boolean;
    }>({ managers: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const managers = await coreApi.getApplicationManagers({ nid, aid });
                if (!cancelled) setState({ managers, loading: false });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [nid, refreshKey]);

    return state;
}

const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUuid = (value: string) => uuidRegex.test(value);


export default function NamespaceAdminsPage() {
    const { profile } = useRouteLoaderData("common") as { profile: KeycloakProfile };
    const { namespaceId, application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto };

    const { addAlert } = useToast();

    const [sub, setSub] = useState("");
    const isValid = sub === "" || isValidUuid(sub);

    const [refreshKey, setRefreshKey] = useState(0);
    const managersWrapper = useManagers(namespaceId, application.id, refreshKey);

    const handleManagerGrant = async () => {
        const requestSub = sub.trim()

        try {
            await coreApi.addApplicationManager({ nid: namespaceId, aid: application.id, uid: requestSub });

            addAlert("Granted!", "success", `Application ${application.name} manager: ${requestSub}.`, 2_000);
            setRefreshKey(k => k + 1);
            setSub("");
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = "Manager already assigned."
                } else if (parsedError.status === 400) {
                    errorMessage = "Wrong request!"
                } else {
                    errorMessage = "Unexpected response. See logs for details..."
                }

                addAlert("Http error!", "danger", errorMessage, 3_000);
            } else {
                console.log(parsedError);
                addAlert("Unknown error!", "danger", "See logs for details...");
            }
        }
    };

    const handleManagerRevoke = async (sub: string) => {
        const requestSub = sub.trim()

        try {
            await coreApi.removeApplicationManager({ nid: namespaceId, aid: application.id, uid: requestSub });

            addAlert("Revoked!", "success", `Application ${application.name} manager: ${requestSub}.`, 2_000);
            setRefreshKey(k => k + 1);
            setSub("");
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 404) {
                    errorMessage = "Manager not found."
                } else if (parsedError.status === 400) {
                    errorMessage = "Wrong request!"
                } else {
                    errorMessage = "Unexpected response. See logs for details..."
                }

                addAlert("Http error!", "danger", errorMessage, 3_000);
            } else {
                console.log(parsedError);
                addAlert("Unknown error!", "danger", "See logs for details...");
            }
        }
    };

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Application {application.name} managers</CardTitle>
                    <CardBody>An application manager is a user, that allowed to modify application information and fully manage its configurations.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Flex direction={{ default: 'row' }}>
                    <FlexItem>
                        <TextInputGroup validated={isValid ? undefined : 'error'}>
                            <TextInputGroupMain
                                placeholder="User subject"
                                value={sub}
                                onChange={(_event, value) => setSub(value)}
                            />
                        </TextInputGroup>
                    </FlexItem>
                    <FlexItem>
                        <Button variant="primary" onClick={handleManagerGrant} isDisabled={sub.length == 0 || !isValid} >Assign manager</Button>
                    </FlexItem>
                </Flex>
            </FlexItem>
            <FlexItem>
                <Divider />
            </FlexItem>
            <FlexItem>
                <Table aria-label="Table">
                    <Thead>
                        <Tr>
                            <Th>Subject name</Th>
                            <Th>Subject id</Th>
                            <Th>Assigner id</Th>
                            <Th screenReaderText="Secondary action" />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {managersWrapper?.loading ? (
                            ""
                        ) : managersWrapper?.managers?.length === 0 ? (
                            ""
                        ) : (
                            managersWrapper?.managers?.map(manager => (
                                <Tr key={manager.subject}>
                                    <Td dataLabel="Subject name">{manager.username ?? "unknown"}</Td>
                                    <Td dataLabel="Subject id">{manager.subject}{profile.id == manager.subject ? " (you)" : ""}</Td>
                                    <Td dataLabel="Assigner id">{manager.assignerSubject}{profile.id == manager.assignerSubject ? " (you)" : ""}</Td>
                                    <Td modifier="fitContent" hasAction>
                                        {profile.id != manager.subject ?
                                            <TableText>
                                                <Button variant="secondary" onClick={() => handleManagerRevoke(manager.subject)}>Revoke</Button>
                                            </TableText>
                                            : ""
                                        }
                                    </Td>
                                </Tr>
                            )
                            )
                        )
                        }
                    </Tbody>
                </Table>
            </FlexItem>
        </Flex>
    )
}
