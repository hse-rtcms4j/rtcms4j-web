import {
    ActionGroup,
    Button,
    Card,
    CardBody,
    CardTitle,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Switch,
    TextArea,
    TextInput,
} from "@patternfly/react-core";
import { useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { useToast } from "@/ui/util/alerts-anchor";
import type { NamespaceDto } from "@/api/generated/core";
import { buildApplicationPath } from "@/router";


export default function NamespaceCreatePage() {
    const navigate = useNavigate();
    const { namespace } = useRouteLoaderData("namespace-layout") as { globalAccess: boolean, namespace: NamespaceDto };
    const { addAlert } = useToast();

    const [isCreationByService, setIsCreationByService] = useState<boolean>(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleNameChange = (_event: any, name: string) => { setName(name); };
    const handleDescriptionChange = (_event: any, description: string) => { setDescription(description); };

    const handleCreateApplication = async () => {
        const requestName = name.trim()

        try {
            const response = await coreApi.createApplication({ nid: namespace.id, applicationCreateRequest: { name: requestName, description: description, creationByService: isCreationByService } });

            addAlert("Success!", "success", `Created application ${response.name}.`, 2_000);
            navigate(buildApplicationPath(response.namespaceId, response.id));
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

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Create new application at namespace {namespace.name}</CardTitle>
                    <CardBody>An application is a container of configurations for serving programs. One program instance expected to access its application configurations.</CardBody>
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
                            <Switch
                                id="simple-switch"
                                label="Allow configurations creation by services"
                                isChecked={isCreationByService}
                                onChange={(_, v) => {setIsCreationByService(v)}}
                                ouiaId="BasicSwitch"
                                isReversed
                            />
                            <ActionGroup>
                                <Button variant="primary" onClick={handleCreateApplication}>Submit</Button>
                            </ActionGroup>
                        </Form>
                    </CardBody>
                </Card>
            </FlexItem>
        </Flex>
    )
}
