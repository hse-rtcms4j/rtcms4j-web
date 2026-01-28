import {
    ActionGroup,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Flex,
    FlexItem,
    Form,
    FormContextProvider,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    MenuToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Select,
    SelectList,
    SelectOption,
    TextInput,
    CodeBlock,
    CodeBlockCode,
} from "@patternfly/react-core";
import { useRouteLoaderData, useRevalidator, useNavigate } from "react-router-dom";
import { useState } from "react";
import { buildApplicationPath } from "@/router";
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { type ApplicationDto, type ConfigurationDetailedDto, type NamespaceDto, SourceType } from "@/api/generated";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";


export default function NamespaceSettingsPage() {
    const navigate = useNavigate();
    const revalidator = useRevalidator()
    const { namespaceId, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    const { addAlert } = useToast();
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const [name, setName] = useState(configuration.name);
    let schemaSourceTypeVal: string = 'Service';
    if (configuration.schemaSourceType == SourceType.Service) {
        schemaSourceTypeVal = 'Service';
    } else if (configuration.schemaSourceType == SourceType.User) {
        schemaSourceTypeVal = 'User';
    }
    const [schemaSourceType, setSchemaSourceType] = useState(schemaSourceTypeVal);

    const [isSchemaModalVisible, setSchemaModalVisible] = useState(false);
    const openSchemaModal = () => setSchemaModalVisible(true);
    const closeSchemaModal = () => setSchemaModalVisible(false);

    const [isValuesModalVisible, setValuesModalVisible] = useState(false);
    const openValuesModal = () => setValuesModalVisible(true);
    const closeValuesModal = () => setValuesModalVisible(false);

    const handleUpdateConfiguration = async () => {
        const requestName = name.trim();
        let requestSchemaSourceType: SourceType = SourceType.Service;
        if (schemaSourceType == 'Service') {
            requestSchemaSourceType = SourceType.Service;
        } else if (schemaSourceType == 'User') {
            requestSchemaSourceType = SourceType.User;
        }

        try {
            const response = await coreApi.updateConfiguration({ nid: namespaceId, aid: application.id, cid: configuration.id, configurationDtoUpdateRequest: { name: requestName, schemaSourceType: requestSchemaSourceType } });

            addAlert("Success!", "success", `Updated configuration ${response.name}.`, 2_000);
            revalidator.revalidate();
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = `There is already configuration named ${requestName}.`
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

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const openDeleteModal = () => setDeleteModalVisible(true);
    const closeDeleteModal = () => setDeleteModalVisible(false);

    const handleDeleteConfiguration = async () => {
        try {
            await coreApi.deleteConfiguration({ nid: namespaceId, aid: application.id, cid: configuration.id });

            addAlert("Success!", "success", `Deleted configuration ${name}.`, 2_000);
            navigate(buildApplicationPath(namespaceId, application.id));
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
            <FlexItem />
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Configuration id</DescriptionListTerm>
                                <DescriptionListDescription>{configuration.id}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Commit id</DescriptionListTerm>
                                <DescriptionListDescription>{configuration.commitId ?? "not present"}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Version</DescriptionListTerm>
                                <DescriptionListDescription>{configuration.commitVersion ?? "not present"}</DescriptionListDescription>
                            </DescriptionListGroup>
                        </DescriptionList>
                    </CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Configuration schema</DescriptionListTerm>
                                <DescriptionListDescription>
                                    {(configuration.jsonSchema?.length ?? 0) != 0 ?
                                        <Button variant="link" isInline icon={<SearchIcon />} onClick={openSchemaModal}>
                                            {configuration.jsonSchema?.length} bytes
                                        </Button> :
                                        "not present"}
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                        </DescriptionList>
                    </CardBody>
                </Card>
                <Modal
                    variant="small"
                    isOpen={isSchemaModalVisible}
                    onClose={closeSchemaModal}
                >
                    <ModalHeader title={`${configuration.name} configuration schema`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        <CodeBlock>
                            <CodeBlockCode>
                                {JSON.stringify(configuration.jsonSchema, null, 2)}
                            </CodeBlockCode>
                        </CodeBlock>
                    </ModalBody>
                    <ModalFooter>
                        <Button key="cancel" variant="link" onClick={closeSchemaModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Configuration values</DescriptionListTerm>
                                <DescriptionListDescription>
                                    {(configuration.jsonValues?.length ?? 0) != 0 ?
                                        <Button variant="link" isInline icon={<SearchIcon />} onClick={openValuesModal}>
                                            {configuration.jsonValues?.length} bytes
                                        </Button> :
                                        "not present"}
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                        </DescriptionList>
                    </CardBody>
                </Card>
                <Modal
                    variant="small"
                    isOpen={isValuesModalVisible}
                    onClose={closeValuesModal}
                >
                    <ModalHeader title={`${configuration.name} configuration values`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        <CodeBlock>
                            <CodeBlockCode>
                                {JSON.stringify(configuration.jsonValues, null, 2)}
                            </CodeBlockCode>
                        </CodeBlock>
                    </ModalBody>
                    <ModalFooter>
                        <Button key="cancel" variant="link" onClick={closeValuesModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <FormContextProvider initialValues={{ 'schemaSourceType': schemaSourceType }}>
                            {({ setValue, getValue }) => (
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
                                    <FormGroup label="Schema sourcetype" isRequired fieldId="horizontal-form-sst">
                                        <Select
                                            id="select-id"
                                            selected={getValue('schemaSourceType')}
                                            isOpen={isSelectOpen}
                                            toggle={(toggleRef) => (
                                                <MenuToggle
                                                    ref={toggleRef}
                                                    onClick={() => setIsSelectOpen(v => !v)}
                                                    isExpanded={isSelectOpen}
                                                >
                                                    {getValue('schemaSourceType')}
                                                </MenuToggle>
                                            )}
                                            onOpenChange={(isOpen) => setIsSelectOpen(isOpen)}
                                            onSelect={(_, value) => {
                                                setValue('schemaSourceType', value as string);
                                                setSchemaSourceType(value as string);
                                                setIsSelectOpen(false);
                                            }}
                                        >
                                            <SelectList>
                                                <SelectOption value="Service">Service</SelectOption>
                                                <SelectOption value="User">User</SelectOption>
                                            </SelectList>
                                        </Select>
                                    </FormGroup>
                                    <ActionGroup>
                                        <Button variant="primary" onClick={handleUpdateConfiguration}>Update</Button>
                                    </ActionGroup>
                                </Form>
                            )}
                        </FormContextProvider>
                    </CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Delete configuration {configuration.name}</CardTitle>
                    <CardBody>Deletion of the configuration includes all its versions.</CardBody>
                    <CardFooter>
                        <Button variant="danger" onClick={openDeleteModal}>Delete configuration</Button>
                    </CardFooter>
                </Card>
                <Modal
                    variant="small"
                    isOpen={isDeleteModalVisible}
                    onClose={closeDeleteModal}
                >
                    <ModalHeader title={`Delete entire ${configuration.name} configuration?`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        Once deleted all its versions will be permanently erased. All working program instances will fail fetching this configuration state.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="danger" onClick={handleDeleteConfiguration}>
                            Delete {configuration.name} configuration!
                        </Button>
                        <Button key="cancel" variant="link" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </FlexItem>
        </Flex>
    )
}
