import {
    ActionGroup,
    Button,
    Card,
    CardBody,
    CardTitle,
    Flex,
    FlexItem,
    Form,
    FormContextProvider,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    MenuToggle,
    Select,
    SelectList,
    SelectOption,
    TextInput,
} from "@patternfly/react-core";
import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { useToast } from "@/ui/util/alerts-anchor";
import { type ApplicationDto, type NamespaceDto, SourceType } from "@/api/generated/core";
import { buildConfigurationPath } from "@/router";


export default function NamespaceCreatePage() {
    const navigate = useNavigate();
    const { namespaceId, application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto };

    const { addAlert } = useToast();

    const [name, setName] = useState('');
    const [schemaSourceType, setSchemaSourceType] = useState('Service');

    const handleCreateConfiguration = async () => {
        const requestName = name.trim()
        let requestSchemaSourceType: SourceType = SourceType.Service;
        if (schemaSourceType == 'Service') {
            requestSchemaSourceType = SourceType.Service;
        } else if (schemaSourceType == 'User') {
            requestSchemaSourceType = SourceType.User;
        }

        try {
            const response = await coreApi.createConfiguration({ nid: namespaceId, aid: application.id, configurationDtoCreateRequest: { name: requestName, schemaSourceType: requestSchemaSourceType } });

            addAlert("Success!", "success", `Created configuration ${response.name}.`, 2_000);
            navigate(buildConfigurationPath(response.namespaceId, response.applicationId, response.id));
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

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    // setError, values, errors
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Create new configuration at application {application.name}</CardTitle>
                    <CardBody>A configuration is a fixed state of key-value properties. One program instance can contain multiple configurations and their states.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <FormContextProvider initialValues={{ 'schemaSourceType': 'Service' }}>
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
                                        <Button variant="primary" onClick={handleCreateConfiguration}>Submit</Button>
                                    </ActionGroup>
                                </Form>
                            )}
                        </FormContextProvider>
                    </CardBody>
                </Card>
            </FlexItem>
        </Flex>
    )
}
