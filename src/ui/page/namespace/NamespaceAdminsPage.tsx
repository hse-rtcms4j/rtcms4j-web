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
import type { NamespaceDto, UserRoleDto } from "@/api/generated";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import type { KeycloakProfile } from "keycloak-js";

function useAdmins(nid: number, refreshKey: number) {
    const [state, setState] = useState<{
        admins: UserRoleDto[] | undefined;
        loading: boolean;
    }>({ admins: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const admins = await coreApi.getNamespaceAdmins({ nid });
                if (!cancelled) setState({ admins: admins, loading: false });
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
    const { namespace } = useRouteLoaderData("namespace-layout") as { globalAccess: boolean, namespace: NamespaceDto };

    const { addAlert } = useToast();

    const [sub, setSub] = useState("");
    const isValid = sub === "" || isValidUuid(sub);

    const [refreshKey, setRefreshKey] = useState(0);
    const adminsWrapper = useAdmins(namespace.id, refreshKey);

    const handleAdminGrant = async () => {
        const requestSub = sub.trim()

        try {
            await coreApi.addNamespaceAdmin({ nid: namespace.id, uid: requestSub });

            addAlert("Granted!", "success", `Namespace ${namespace.name} admin: ${requestSub}.`, 2_000);
            setRefreshKey(k => k + 1);
            setSub("");
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = "Admin already assigned."
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

    const handleAdminRevoke = async (sub: string) => {
        const requestSub = sub.trim()

        try {
            await coreApi.removeNamespaceAdmin({ nid: namespace.id, uid: requestSub });

            addAlert("Revoked!", "success", `Namespace ${namespace.name} admin: ${requestSub}.`, 2_000);
            setRefreshKey(k => k + 1);
            setSub("");
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = "Admin already assigned."
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
                    <CardTitle>Namespace {namespace.name} admins</CardTitle>
                    <CardBody>A namespace admin is a user, that allowed to modify namespace information and fully manage containing applications and their configurations.</CardBody>
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
                        <Button variant="primary" onClick={handleAdminGrant} isDisabled={sub.length == 0 || !isValid} >Grant</Button>
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
                        {adminsWrapper?.loading ? (
                            ""
                        ) : adminsWrapper?.admins?.length === 0 ? (
                            ""
                        ) : (
                            adminsWrapper?.admins?.map(admin => (
                                <Tr key={admin.subject}>
                                    <Td dataLabel="Subject name">{admin.username ?? "unknown"}</Td>
                                    <Td dataLabel="Subject id">{admin.subject}</Td>
                                    <Td dataLabel="Assigner id">{admin.assignerSubject}</Td>
                                    <Td modifier="fitContent" hasAction>
                                        {profile.id != admin.subject ?
                                            <TableText>
                                                <Button variant="secondary" onClick={() => handleAdminRevoke(admin.subject)}>Revoke</Button>
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
