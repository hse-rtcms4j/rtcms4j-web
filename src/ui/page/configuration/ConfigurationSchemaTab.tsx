import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Flex,
    FlexItem,
    FormSelect,
    FormSelectOption,
    Grid,
    GridItem,
    Switch,
    TextInput,
} from "@patternfly/react-core";
import { useRouteLoaderData, useRevalidator } from "react-router-dom";
import { useState } from "react";
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { type ApplicationDto, type ConfigurationDetailedDto, type NamespaceDto, SourceType } from "@/api/generated/core";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

type SchemaRow = {
    id: string;
    key: string;
    type: string;
    defaultValue: string;
    description?: string;
};

const propertyVersionKey = 'version';
const propertyVersionType = 'string';
const propertyVersionDefaultValue = '1.0.0';
const propertyVersionDescription = 'Commit compatibility version.';
function withVersion(rows: SchemaRow[], versionValue: string) {
    return [{ id: crypto.randomUUID(), key: propertyVersionKey, type: propertyVersionType, defaultValue: versionValue, description: propertyVersionDescription }, ...rows];
};

function toJSONSchema(rows: SchemaRow[]): string {
    const properties: Record<string, any> = {};

    rows.forEach((row) => {
        const { key, type, defaultValue, description } = row;
        if (key.length !== 0 && defaultValue.length !== 0) {
            let value: string | boolean | number = defaultValue;

            if (type == 'boolean') {
                if (defaultValue == 'true') {
                    value = true;
                } else if (defaultValue == 'false') {
                    value = false;
                }
            } else if (type == 'number') {
                value = Number(defaultValue);
            }

            properties[key] = {
                type: type,
                default: value,
                description: description || ""
            };
        }
    });

    return JSON.stringify({
        type: 'object',
        properties: properties
    }, null, 2);
};

function toJSONValues(jsonSchema: string): string {
    const parsedSchema = JSON.parse(jsonSchema);
    const defaultObject: Record<string, any> = {};

    Object.keys(parsedSchema.properties || {}).forEach((key) => {
        const property = parsedSchema.properties[key];

        defaultObject[key] = property.default;
    });

    return JSON.stringify(defaultObject, null, 2);
};

function fromJSONSchema(jsonSchema: string): SchemaRow[] {
    let parsed = undefined;
    try {
        parsed = JSON.parse(jsonSchema);
    } catch (error) {
        return [];
    }

    const rows: SchemaRow[] = [];
    const properties = parsed?.properties || {};

    Object.keys(properties).forEach((key) => {
        const prop = properties[key];

        const row: SchemaRow = {
            id: crypto.randomUUID(),
            key: key,
            type: prop.type || 'boolean',
            defaultValue: prop.default || 'false',
            description: prop.description || ''
        };

        rows.push(row);
    });

    return rows;
};


export default function NamespaceSchemaTab() {
    const { namespaceId, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    if (configuration.schemaSourceType == SourceType.Service) {
        return (
            <Flex direction={{ default: 'column' }}>
                <FlexItem />
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardTitle>{configuration.name} configuration schema modification by user is disabled</CardTitle>
                        <CardBody>Schema Source Type is set to Service. It means that only program applications can commit schema state.</CardBody>
                    </Card>
                </FlexItem>
            </Flex>
        )
    }

    const { addAlert } = useToast();
    const revalidator = useRevalidator();

    const [schemaCode, setSchemaCode] = useState<string>(configuration.jsonSchema ?? "");

    const parsedRows = fromJSONSchema(schemaCode);
    const version = parsedRows.find((row: SchemaRow) => row.key == propertyVersionKey)?.defaultValue ?? propertyVersionDefaultValue;
    const managingRows = parsedRows.filter((row: SchemaRow) => row.key != propertyVersionKey);

    const [configVersion, setConfigVersion] = useState<string>(version);
    const [rows, setRows] = useState<SchemaRow[]>(managingRows);

    const updateRow = (
        index: number,
        field: keyof SchemaRow,
        value: string | boolean
    ) => {
        setRows(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };
    const addRow = () => {
        setRows(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                key: '',
                type: 'boolean',
                defaultValue: 'false',
                description: '',
            }
        ]);
    };
    const removeRow = (index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    };

    const handleCommitConfigurationSchemaByGui = () => {
        handleCommitConfigurationSchema(toJSONSchema(withVersion(rows, configVersion)));
    };

    const handleCommitConfigurationSchemaByRaw = () => {
        handleCommitConfigurationSchema(schemaCode);
    };

    const handleCommitConfigurationSchema = async (jsonSchema: string) => {
        const jsonValues = toJSONValues(jsonSchema);
        console.log(jsonSchema);
        console.log(jsonValues);
        try {
            const response = await coreApi.commitConfiguration({ nid: namespaceId, aid: application.id, cid: configuration.id, configurationCommitRequest: { jsonSchema: jsonSchema, jsonValues: jsonValues } });

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

    const [isGuiMode, setIsGuiMode] = useState<boolean>(true);
    const switchGuiMode = (isGui: boolean) => {
        if (isGui) {
            const parsedRows = fromJSONSchema(schemaCode);
            const version = parsedRows.find((row: SchemaRow) => row.key == propertyVersionKey)?.defaultValue ?? propertyVersionDefaultValue;
            const managingRows = parsedRows.filter((row: SchemaRow) => row.key != propertyVersionKey);

            setConfigVersion(version);
            setRows(managingRows);
        } else {
            setSchemaCode(toJSONSchema(withVersion(rows, configVersion)));
        }

        setIsGuiMode(isGui);
    };

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem />
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <Switch
                            id="simple-switch"
                            label="GUI editor"
                            isChecked={isGuiMode}
                            onChange={(_, v) => switchGuiMode(v)}
                            ouiaId="BasicSwitch"
                            isReversed
                        />
                    </CardBody>
                </Card>
            </FlexItem>
            {isGuiMode ?
                <FlexItem>
                    <Card ouiaId="BasicCard">
                        <CardBody>
                            <Grid component="ul" hasGutter>
                                <GridItem component="li">
                                    <Grid hasGutter>
                                        <GridItem span={3}>Key*</GridItem>
                                        <GridItem span={2}>Type*</GridItem>
                                        <GridItem span={2}>Initial Value*</GridItem>
                                        <GridItem span={3}>Description</GridItem>
                                        <GridItem span={1} />
                                    </Grid>
                                </GridItem>
                                <GridItem component="li">
                                    <Grid hasGutter>
                                        <GridItem span={3}>
                                            <TextInput
                                                id="propertyVersionKey"
                                                value={propertyVersionKey}
                                                isDisabled
                                                readOnly
                                            />
                                        </GridItem>
                                        <GridItem span={2}>
                                            <TextInput
                                                id="propertyVersionType"
                                                value={propertyVersionType}
                                                isDisabled
                                                readOnly
                                            />
                                        </GridItem>
                                        <GridItem span={2}>
                                            <TextInput
                                                id="propertyVersionValue"
                                                value={configVersion}
                                                onChange={(_, value) => setConfigVersion(value)}
                                            />
                                        </GridItem>
                                        <GridItem span={3}>
                                            <TextInput
                                                id="propertyVersionDescription"
                                                value={propertyVersionDescription}
                                                isDisabled
                                                readOnly
                                            />
                                        </GridItem>
                                        <GridItem span={1} />
                                    </Grid>
                                </GridItem>
                                {rows.map((row, index) => (
                                    <GridItem key={row.id} component="li">
                                        <Grid key={row.id} hasGutter>
                                            <GridItem span={3}>
                                                <TextInput
                                                    id={`${row.id}_key`}
                                                    value={row.key}
                                                    onChange={(_, value) => updateRow(index, 'key', value)}
                                                    isRequired
                                                />
                                            </GridItem>

                                            <GridItem span={2}>
                                                <FormSelect
                                                    id={`${row.id}_type`}
                                                    value={row.type}
                                                    onChange={(_, value) =>
                                                        updateRow(index, 'type', value)
                                                    }
                                                >
                                                    <FormSelectOption value="string" label="string" />
                                                    <FormSelectOption value="boolean" label="boolean" />
                                                    <FormSelectOption value="number" label="number" />
                                                </FormSelect>
                                            </GridItem>

                                            <GridItem span={2}>
                                                {row.type == 'number' ?
                                                    <TextInput
                                                        id={`${row.id}_defaultValue`}
                                                        isRequired
                                                        value={row.defaultValue}
                                                        type="number"
                                                        onChange={(_, value) => updateRow(index, 'defaultValue', value)}
                                                    /> : row.type == 'boolean' ?
                                                        <FormSelect
                                                            id={`${row.id}_defaultValue`}
                                                            isRequired
                                                            value={row.defaultValue}
                                                            onChange={(_, value) => updateRow(index, 'defaultValue', value)}
                                                        >
                                                            <FormSelectOption value="true" label="true" />
                                                            <FormSelectOption value="false" label="false" />
                                                        </FormSelect> :
                                                        <TextInput
                                                            id={`${row.id}_defaultValue`}
                                                            isRequired
                                                            value={row.defaultValue}
                                                            onChange={(_, value) => updateRow(index, 'defaultValue', value)}
                                                        />
                                                }

                                            </GridItem>

                                            <GridItem span={3}>
                                                <TextInput
                                                    id={`${row.id}_description`}
                                                    value={row.description}
                                                    onChange={(_, value) => updateRow(index, 'description', value)}
                                                />
                                            </GridItem>

                                            <GridItem span={1}>
                                                <Button
                                                    variant="plain"
                                                    icon={<TimesIcon />}
                                                    onClick={() => removeRow(index)}
                                                    aria-label="Remove row"
                                                />
                                            </GridItem>
                                        </Grid>
                                    </GridItem>
                                ))}
                                <GridItem>
                                    <Button
                                        variant="link"
                                        icon={<PlusIcon />}
                                        onClick={addRow}
                                    >
                                        Add property
                                    </Button>
                                </GridItem>
                            </Grid>
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationSchemaByGui}>Commit schema</Button>
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
                                code={schemaCode}
                                onChange={(value, _) => setSchemaCode(value)}
                                language={Language.json}
                                height="400px"
                            />
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationSchemaByRaw}>Commit schema</Button>
                        </CardFooter>
                    </Card>
                </FlexItem>
            }
        </Flex >
    )
}
