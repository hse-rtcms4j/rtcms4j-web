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
    FormHelperText,
    FormSelect,
    FormSelectOption,
    HelperText,
    HelperTextItem,
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
import ArrayInput from "@/ui/component/ArrayInput"
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";

type ValuesRow = {
    id: string;
    key: string;
    value: any;
    type: string;
    description?: string;
    isList?: boolean;
    itemsType?: string;
    enumValues?: string[];
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

    const resolveRef = (ref: string): any => {
        if (!ref.startsWith('#/')) return {};
        const path = ref.substring(2).split('/');
        let result: any = parsedSchema;
        for (const segment of path) {
            if (result && typeof result === 'object') {
                result = result[segment];
            } else {
                return {};
            }
        }
        return result;
    };

    const getTypeInfo = (prop: any): { type: string, itemsType?: string, isList: boolean, enumValues?: string[] } => {
        // Resolve $ref if present
        let actualProp = prop;
        if (prop.$ref) {
            actualProp = resolveRef(prop.$ref);
        }

        let type = actualProp.type || 'string';
        let isList = false;
        let itemsType: string | undefined = undefined;
        let enumValues: string[] | undefined = undefined;

        if (type === 'array' && actualProp.items) {
            isList = true;
            const itemsDef = actualProp.items.$ref ? resolveRef(actualProp.items.$ref) : actualProp.items;
            itemsType = itemsDef.type || 'string';

            if (itemsDef.enum && Array.isArray(itemsDef.enum)) {
                enumValues = itemsDef.enum;
            }
        } else if (actualProp.enum && Array.isArray(actualProp.enum)) {
            enumValues = actualProp.enum;
        }

        return { type, itemsType, isList, enumValues };
    };

    const sortedKeys = Object.keys(properties).sort((a, b) => {
        if (a === 'version') return 1;
        if (b === 'version') return -1;
        return 0;
    });

    sortedKeys.forEach((key) => {
        const prop = properties[key];
        const { type, itemsType, isList, enumValues } = getTypeInfo(prop);

        const row: ValuesRow = {
            id: crypto.randomUUID(),
            key: key,
            value: parsedValues[key],
            type: type,
            description: prop.description || '',
            isList: isList,
            itemsType: itemsType,
            enumValues: enumValues
        };

        rows.push(row);
    });

    return rows;
};

function toJSONValues(rows: ValuesRow[]): string {
    const defaultObject: Record<string, any> = {};
    console.log(rows);

    rows.forEach((row) => {
        let value: any = row.value;

        if (row.isList && Array.isArray(value)) {
            if (row.itemsType === 'boolean') {
                value = value.map((v: any) => v === true || v === 'true');
            } else if (row.itemsType === 'number') {
                value = value.map((v: any) => parseFloat(v));
            } else if (row.itemsType === 'integer') {
                value = value.map((v: any) => parseInt(v, 10));
            } else if (row.itemsType === 'string') {
                value = value.map((v: any) => String(v));
            }
        }

        else {
            if (row.type === 'boolean') {
                value = value === true || value === 'true';
            } else if (row.type === 'number') {
                value = parseFloat(value);
            } else if (row.type === 'integer') {
                value = parseInt(value, 10);
            } else if (row.type === 'string') {
                value = String(value);
            }
        }

        defaultObject[row.key] = value;
    });

    return JSON.stringify(defaultObject, null, 2);
};

function renderInput(row: ValuesRow, index: number, updateRow: any) {
    // Handle arrays
    if (row.isList) {
        return (
            <ArrayInput
                id={`${row.id}_value`}
                type={row.itemsType}
                enumValues={row.enumValues}
                value={row.value}
                onChange={(newValue) => updateRow(index, 'value', newValue)}
            />
        );
    }

    // Handle enums (non-array)
    if (row.enumValues && row.enumValues.length > 0) {
        return (
            <FormSelect
                id={`${row.id}_value`}
                isRequired
                value={row.value || ''}
                onChange={(_, value) => updateRow(index, 'value', value)}
            >
                {row.enumValues.map((enumVal) => (
                    <FormSelectOption key={enumVal} value={enumVal} label={enumVal} />
                ))}
            </FormSelect>
        );
    }

    // Handle primitives
    if (row.type === 'integer' || row.type === 'number') {
        const value = row.value ?? '';
        let validatedState: "error" | "default" | "success" | "warning" | undefined = "default";
        let errorText = '';

        const num = parseFloat(value);
        if (isNaN(num)) {
            validatedState = "error";
            errorText = 'Must be a valid number';
        } else if (row.type === 'integer' && !Number.isInteger(num)) {
            validatedState = "error";
            errorText = 'Must be an integer';
        }

        return (
            <>
                <TextInput
                    id={`${row.id}_value`}
                    isRequired
                    value={row.value ?? ''}
                    type="number"
                    validated={validatedState}
                    onChange={(_, value) => updateRow(index, 'value', value)}
                />
                {validatedState === 'error' ? (
                    <FormHelperText>
                        <HelperText>
                            <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
                                {errorText}
                            </HelperTextItem>
                        </HelperText>
                    </FormHelperText>
                ) : ''}
            </>
        );
    }

    if (row.type === 'boolean') {
        return (
            <FormSelect
                id={`${row.id}_value`}
                isRequired
                value={row.value ? 'true' : 'false'}
                onChange={(_, value) => updateRow(index, 'value', value)}
            >
                <FormSelectOption value="true" label="true" />
                <FormSelectOption value="false" label="false" />
            </FormSelect>
        );
    }

    // Default: string
    return (
        <TextInput
            id={`${row.id}_value`}
            isRequired
            value={row.value ?? ''}
            onChange={(_, value) => updateRow(index, 'value', value)}
        />
    );
}


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
                                    <Card component="div" key={row.id}>
                                        <DescriptionListTerm>{row.key}</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Flex direction={{ default: 'column' }}>
                                                <FlexItem>
                                                    {renderInput(row, index, updateRow)}
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
