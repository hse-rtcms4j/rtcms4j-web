import {
    ActionGroup,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
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
    TextArea,
    TextInput,
} from "@patternfly/react-core";
import { useRouteLoaderData, useRevalidator, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { NamespaceDto } from "@/api/generated";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { namespacesPath } from "@/router";


export default function NamespaceSettingsPage() {
    const navigate = useNavigate();
    const revalidator = useRevalidator()
    const { globalAccess, namespace } = useRouteLoaderData("namespace-layout") as { globalAccess: boolean, namespace: NamespaceDto };

    const { addAlert } = useToast();

    const [name, setName] = useState(namespace.name);
    const [description, setDescription] = useState(namespace.description);
    const handleNameChange = (_event: any, name: string) => { setName(name); };
    const handleDescriptionChange = (_event: any, description: string) => { setDescription(description); };

    const handleUpdateNamespace = async () => {
        const requestName = name.trim();

        try {
            const response = await coreApi.updateNamespace({ nid: namespace.id, namespaceUpdateRequest: { name: requestName, description: description } });

            addAlert("Success!", "success", `Updated namespace ${response.name}.`, 2_000);
            revalidator.revalidate();
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = `There is already namespace named ${requestName}.`
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

    const handleDeleteNamespace = async () => {
        try {
            await coreApi.deleteNamespace({ nid: namespace.id });

            addAlert("Success!", "success", `Deleted namespace ${name}.`, 2_000);
            navigate(namespacesPath);
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

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Namespace {namespace.name} settings</CardTitle>
                    <CardBody>A namespace is a set of applications restricted for some users and serving program clients. Mainly dedicated to separate development teams' fields.</CardBody>
                </Card>
            </FlexItem>
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
                                    onChange={handleNameChange}
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
                                    onChange={handleDescriptionChange}
                                    id="horizontal-form-description"
                                    name="horizontal-form-description"
                                />
                            </FormGroup>
                            <ActionGroup>
                                <Button variant="primary" onClick={handleUpdateNamespace}>Update</Button>
                            </ActionGroup>
                        </Form>
                    </CardBody>
                </Card>
            </FlexItem>
            {globalAccess ?
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardTitle>Delete namespace {namespace.name}</CardTitle>
                        <CardBody>Deletion of the namespace includes its admins, applications and configurations.</CardBody>
                        <CardFooter>
                            <Button variant="danger" onClick={openModal}>Delete namespace</Button>
                            <Modal
                                variant="small"
                                isOpen={isModalVisible}
                                onClose={closeModal}
                            >
                                <ModalHeader title={`Delete entire ${namespace.name} namespace?`} labelId="variant-modal-title" />
                                <ModalBody id="modal-box-body-variant">
                                    Once deleted all applications will be cascadingly deleted as well as their configurations. All related working program instances will fail fetching applications info and its configurations.
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="danger" onClick={handleDeleteNamespace}>
                                        Delete {namespace.name} namespace!
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
    )
}
