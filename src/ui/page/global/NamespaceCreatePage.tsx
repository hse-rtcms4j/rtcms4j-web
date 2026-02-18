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
    TextArea,
    TextInput,
} from "@patternfly/react-core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { useToast } from "@/ui/util/alerts-anchor";
import { buildNamespacePath } from "@/router"


export default function NamespaceCreatePage() {
    const navigate = useNavigate();
    const { addAlert } = useToast();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleNameChange = (_event: any, name: string) => { setName(name); };
    const handleDescriptionChange = (_event: any, description: string) => { setDescription(description); };

    const handleCreateNamespace = async () => {
        const requestName = name.trim()

        try {
            const response = await coreApi.createNamespace({ namespaceCreateRequest: { name: requestName, description: description } });

            addAlert("Success!", "success", `Created namespace ${response.name}.`, 2_000);
            navigate(buildNamespacePath(response.id));
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

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Create new namespaces</CardTitle>
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
                                <Button variant="primary" onClick={handleCreateNamespace}>Submit</Button>
                            </ActionGroup>
                        </Form>
                    </CardBody>
                </Card>
            </FlexItem>
        </Flex>
    )
}
