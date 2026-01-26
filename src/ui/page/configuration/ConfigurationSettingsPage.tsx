import {
    ActionGroup,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    EmptyState,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Tab,
    Tabs,
    TabTitleText,
    TextArea,
    TextInput,
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities,
} from "@patternfly/react-core";
import { useRouteLoaderData, useRevalidator, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildNamespacePath } from "@/router";
import EyeIcon from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import EyeSlashIcon from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon';
import type { ApplicationDto, KeycloakClientDto, NamespaceDto } from "@/api/generated";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";

function useKeycloakClient(namespaceId: number, applicationId: number, refreshKey: number) {
    const [state, setState] = useState<{
        keycloakClient: KeycloakClientDto | undefined;
        loading: boolean;
    }>({ keycloakClient: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const keycloakClient = await coreApi.getApplicationClient({ nid: namespaceId, aid: applicationId });
                if (!cancelled) setState({ keycloakClient, loading: false });
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


export default function NamespaceSettingsPage() {
    const navigate = useNavigate();
    const revalidator = useRevalidator()
    const { globalAccess, namespaceId, namespace, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDto };

    const { addAlert } = useToast();

    const [name, setName] = useState(application.name);
    const [description, setDescription] = useState(application.description);

    const handleUpdateApplication = async () => {
        const requestName = name.trim();

        try {
            const response = await coreApi.updateApplication({ nid: namespaceId, aid: application.id, applicationUpdateRequest: { name: requestName, description: description } });

            addAlert("Success!", "success", `Updated application ${response.name}.`, 2_000);
            revalidator.revalidate();
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = `There is already application named ${requestName}.`
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

    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const handleDeleteApplication = async () => {
        try {
            await coreApi.deleteApplication({ nid: namespaceId, aid: application.id });

            addAlert("Success!", "success", `Deleted application ${name}.`, 2_000);
            navigate(buildNamespacePath(namespaceId));
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
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

    const [refreshKey, setRefreshKey] = useState(0);
    const keycloakClient = useKeycloakClient(namespaceId, application.id, refreshKey);
    const [clientIdVisible, setClientIdVisible] = useState(false);
    const [clientSecretVisible, setClientSecretVisible] = useState(false);

    const handleRotateApplicationSecret = async () => {
        try {
            await coreApi.rotateApplicationClientPassword({ nid: namespaceId, aid: application.id });

            addAlert("Success!", "success", `Rotated application client secret.`, 2_000);
            setRefreshKey(v => v + 1);
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
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

    const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Application {application.name} settings</CardTitle>
                    <CardBody>An application is a container of configurations for serving programs. One program instance expected to access its application configurations.</CardBody>
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
                        <Flex direction={{ default: 'column' }}>
                            <FlexItem>
                                <Card ouiaId="BasicCard">
                                    <CardBody>
                                        <Form isHorizontal>
                                            <FormGroup label="Name" isRequired fieldId="horizontal-form-name">
                                                <TextInput
                                                    value={name}
                                                    isRequired
                                                    type="text"
                                                    id="horizontal-form-name"
                                                    aria-describedby="horizontal-form-name-helper"
                                                    name="horizontal-form-name"
                                                    onChange={(_, name) => setName(name)}
                                                />
                                                <FormHelperText>
                                                    <HelperText>
                                                        <HelperTextItem>Name must be unique.</HelperTextItem>
                                                    </HelperText>
                                                </FormHelperText>
                                            </FormGroup>
                                            <FormGroup label="Description" fieldId="horizontal-form-description">
                                                <TextArea
                                                    value={description}
                                                    onChange={(_, description) => setDescription(description)}
                                                    id="horizontal-form-description"
                                                    name="horizontal-form-description"
                                                />
                                            </FormGroup>
                                            <ActionGroup>
                                                <Button variant="primary" onClick={handleUpdateApplication}>Update</Button>
                                            </ActionGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </FlexItem>
                            {namespace !== undefined ?
                                <FlexItem>
                                    <Card ouiaId="BasicCard">
                                        <CardTitle>Delete application {application.name}</CardTitle>
                                        <CardBody>Deletion of the application includes its managers and configurations.</CardBody>
                                        <CardFooter>
                                            <Button variant="danger" onClick={openModal}>Delete application</Button>
                                            <Modal
                                                variant="small"
                                                isOpen={isModalVisible}
                                                onClose={closeModal}
                                            >
                                                <ModalHeader title={`Delete entire ${application.name} application?`} labelId="variant-modal-title" />
                                                <ModalBody id="modal-box-body-variant">
                                                    Once deleted all configurations will be cascadingly permanently deleted. All working program instances will fail fetching application info and its configurations.
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button variant="danger" onClick={handleDeleteApplication}>
                                                        Delete {application.name} application!
                                                    </Button>
                                                    <Button key="cancel" variant="link" onClick={closeModal}>
                                                        Cancel
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        </CardFooter>
                                    </Card>
                                </FlexItem>
                                : ""
                            }
                        </Flex>
                    </Tab>
                    <Tab eventKey={1} title={<TabTitleText>Program credentials</TabTitleText>}>
                        <Card ouiaId="BasicCard">
                            <CardTitle>Keycloak client credentials</CardTitle>
                            <CardBody>Client id and secret are automatically generated and cannot be assigned directly. In case you suspect secret compromise, you can rotate it.</CardBody>
                            <CardFooter>
                                {keycloakClient.loading ? (
                                    <FlexItem>
                                        <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner} />
                                    </FlexItem>
                                ) : keycloakClient.keycloakClient == undefined ? (
                                    <FlexItem>
                                        <EmptyState titleText="Unable to load keycloak client credentials." headingLevel="h4" />
                                    </FlexItem>
                                ) : (
                                    <Form isHorizontal>
                                        <FormGroup label="Client Id" fieldId="horizontal-form-client-id">
                                            <TextInputGroup>
                                                <TextInputGroupMain
                                                    value={keycloakClient.keycloakClient.clientId}
                                                    type={clientIdVisible ? "text" : "password"}
                                                    readOnly={true}
                                                    id="client-id"
                                                />
                                                <TextInputGroupUtilities>
                                                    <Button
                                                        variant="plain"
                                                        aria-label="Show"
                                                        icon={clientIdVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                                        onClick={() => setClientIdVisible(v => !v)}
                                                    />
                                                </TextInputGroupUtilities>
                                            </TextInputGroup>
                                        </FormGroup>
                                        <FormGroup label="Client Secret" fieldId="horizontal-form-client-sec">
                                            <Flex direction={{ default: 'row' }}>
                                                <FlexItem flex={{ default: 'flex_1' }}>
                                                    <TextInputGroup>
                                                        <TextInputGroupMain
                                                            value={keycloakClient.keycloakClient.secret}
                                                            type={clientSecretVisible ? "text" : "password"}
                                                            readOnly={true}
                                                            id="client-secret"
                                                        />
                                                        <TextInputGroupUtilities>
                                                            <Button
                                                                variant="plain"
                                                                aria-label="Show"
                                                                icon={clientSecretVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                                                onClick={() => setClientSecretVisible(v => !v)}
                                                            />
                                                        </TextInputGroupUtilities>
                                                    </TextInputGroup>
                                                </FlexItem>
                                                <FlexItem>
                                                    <Button variant="primary" onClick={handleRotateApplicationSecret}>Rotate secret</Button>
                                                </FlexItem>
                                            </Flex>
                                        </FormGroup>
                                    </Form>
                                )
                                }
                            </CardFooter>
                        </Card>
                    </Tab>
                </Tabs>
            </FlexItem>
        </Flex>
    )
}
