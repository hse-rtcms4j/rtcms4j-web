import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListTerm,
    Flex,
    FlexItem,
    FormSelect,
    FormSelectOption,
    Switch,
    TextInput,
} from "@patternfly/react-core";
import { useRouteLoaderData, useRevalidator } from "react-router-dom";
import { useState } from "react";
import { type ApplicationDto, type ConfigurationDetailedDto, type NamespaceDto } from "@/api/generated/core";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

type ValuesRow = {
    id: string;
    key: string;
    value: string;
    type: string;
    description?: string;
};

function fromJSONSchema(jsonSchema: string, jsonValues: string): ValuesRow[] {
    let parsedSchema = undefined;
    try {
        parsedSchema = JSON.parse(jsonSchema);
    } catch (error) {
        return [];
    }

    let parsedValues = undefined;
    try {
        parsedValues = JSON.parse(jsonValues);
    } catch (error) {
        return [];
    }

    const rows: ValuesRow[] = [];
    const properties = parsedSchema?.properties || {};

    Object.keys(properties).forEach((key) => {
        const prop = properties[key];

        const row: ValuesRow = {
            id: crypto.randomUUID(),
            key: key,
            value: parsedValues[key],
            type: prop.type,
            description: prop.description || ''
        };

        rows.push(row);
    });

    return rows;
};

function toJSONValues(rows: ValuesRow[]): string {
    const defaultObject: Record<string, any> = {};

    rows.forEach((row) => {
        let value: string | boolean | number = row.value;

        if (row.type == 'boolean') {
            if (row.value == 'true') {
                value = true;
            } else if (row.value == 'false') {
                value = false;
            }
        } else if (row.type == 'number') {
            value = Number(row.value);
        }

        defaultObject[row.key] = value;
    });

    return JSON.stringify(defaultObject, null, 2);
};


export default function NamespaceValuesTab() {
    const { namespaceId, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    if (configuration.jsonSchema == undefined || configuration.jsonValues == undefined) {
        return (
            <Flex direction={{ default: 'column' }}>
                <FlexItem />
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardTitle>{configuration.name} configuration has no schema yet.</CardTitle>
                        <CardBody>To commit values you have to create schema first.</CardBody>
                    </Card>
                </FlexItem>
            </Flex>
        )
    }
    const jsonSchema = configuration.jsonSchema;

    const { addAlert } = useToast();
    const revalidator = useRevalidator();

    const [valuesCode, setValuesCode] = useState<string>(configuration.jsonValues);
    const [rows, setRows] = useState<ValuesRow[]>(fromJSONSchema(jsonSchema, configuration.jsonValues));

    const updateRow = (
        index: number,
        field: keyof ValuesRow,
        value: string | boolean
    ) => {
        setRows(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    const handleCommitConfigurationValuesByGui = () => {
        handleCommitConfigurationValues(toJSONValues(rows));
    };

    const handleCommitConfigurationValuesByRaw = () => {
        handleCommitConfigurationValues(valuesCode);
    };

    const handleCommitConfigurationValues = async (jsonValues: string) => {
        console.log(jsonValues);
        try {
            const response = await coreApi.commitConfiguration({ nid: namespaceId, aid: application.id, cid: configuration.id, configurationCommitRequest: { jsonValues: jsonValues } });

            addAlert("Success!", "success", `Commited with id ${response.commitId}.`, 2_000);
            revalidator.revalidate();
        } catch (unknownError) {
            const parsedError = await parseApiFetchError(unknownError)

            if (parsedError.kind == "http") {
                let errorMessage: string

                if (parsedError.dto?.detailMessage !== undefined) {
                    errorMessage = parsedError.dto?.detailMessage
                } else if (parsedError.status === 409) {
                    errorMessage = `There is already existing commit.`
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

    const [isGuiEditor, setIsGuiEditor] = useState<boolean>(true);
    const switchGuiEditor = (isGui: boolean) => {
        if (isGui) {
            setRows(fromJSONSchema(jsonSchema, valuesCode));
        } else {
            setValuesCode(toJSONValues(rows));
        }

        setIsGuiEditor(isGui);
    };

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem />
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <Switch
                            id="simple-switch-2"
                            label="GUI editor"
                            isChecked={isGuiEditor}
                            onChange={(_, v) => switchGuiEditor(v)}
                            ouiaId="BasicSwitch-2"
                            isReversed
                        />
                    </CardBody>
                </Card>
            </FlexItem>
            {isGuiEditor ?
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardBody>
                            <DescriptionList isHorizontal>
                                {rows.map((row, index) => (
                                    <Card component="div">
                                        <DescriptionListTerm>{row.key}</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Flex direction={{ default: 'column' }}>
                                                <FlexItem>
                                                    {row.type == 'number' ?
                                                        <TextInput
                                                            id={`${row.id}_value`}
                                                            isRequired
                                                            value={row.value}
                                                            type="number"
                                                            onChange={(_, value) => updateRow(index, 'value', value)}
                                                        /> : row.type == 'boolean' ?
                                                            <FormSelect
                                                                id={`${row.id}_value`}
                                                                isRequired
                                                                value={row.value}
                                                                onChange={(_, value) => updateRow(index, 'value', value)}
                                                            >
                                                                <FormSelectOption value="true" label="true" />
                                                                <FormSelectOption value="false" label="false" />
                                                            </FormSelect> :
                                                            <TextInput
                                                                id={`${row.id}_value`}
                                                                isRequired
                                                                value={row.value}
                                                                onChange={(_, value) => updateRow(index, 'value', value)}
                                                            />
                                                    }
                                                </FlexItem>
                                                <FlexItem>
                                                    {row.description}
                                                </FlexItem>
                                            </Flex>
                                        </DescriptionListDescription>
                                    </Card>
                                ))}
                            </DescriptionList>
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationValuesByGui}>Commit values</Button>
                        </CardFooter>
                    </Card>
                </FlexItem>
                :
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardBody>
                            <CodeEditor
                                isLanguageLabelVisible
                                isDarkTheme={true}
                                isLineNumbersVisible={true}
                                isReadOnly={false}
                                isMinimapVisible={false}
                                code={valuesCode}
                                onChange={(value, _) => setValuesCode(value)}
                                language={Language.json}
                                height="400px"
                            />
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationValuesByRaw}>Commit values</Button>
                        </CardFooter>
                    </Card>
                </FlexItem>
            }
        </Flex >
    )
}
