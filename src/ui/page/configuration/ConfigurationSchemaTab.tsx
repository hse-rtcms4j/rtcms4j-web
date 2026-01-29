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
import { useRouteLoaderData, useRevalidator, useNavigate } from "react-router-dom";
import { useState } from "react";
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import PlusIcon from '@patternfly/react-icons/dist/esm/icons/plus-icon';
import { type ApplicationDto, type ConfigurationDetailedDto, type NamespaceDto, SourceType } from "@/api/generated";
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


export default function NamespaceSettingsPage() {
    const { namespaceId, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    if (configuration.schemaSourceType == SourceType.Service) {
        return (
            <Card ouiaId="BasicCard">
                <CardTitle>{configuration.name} configuration schema modification by user is disabled</CardTitle>
                <CardBody>Schema Source Type is set to Service. It means that only program applications can commit schema state.</CardBody>
            </Card>
        )
    }

    const navigate = useNavigate();
    const revalidator = useRevalidator()
    const { addAlert } = useToast();

    const [rows, setRows] = useState<SchemaRow[]>([
        {
            id: crypto.randomUUID(),
            key: '',
            type: 'Boolean',
            defaultValue: '',
            description: ''
        }
    ]);
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
                type: 'Boolean',
                defaultValue: '',
                description: '',
            }
        ]);
    };
    const removeRow = (index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    };

    const [configSchema, setConfigSchema] = useState<string>(configuration.jsonSchema ?? "");
    const [configValues, setConfigValues] = useState<string>("");

    const handleCommitConfigurationSchema = async () => {
        //         try {
        //             const response = await coreApi.commitConfiguration({ nid: namespaceId, aid: application.id, cid: configuration.id, configurationCommitRequest: { jsonSchema: configSchema, jsonValues: configValues } });
        //
        //             addAlert("Success!", "success", `Commited with id ${response.commitId}.`, 2_000);
        //             revalidator.revalidate();
        //         } catch (unknownError) {
        //             const parsedError = await parseApiFetchError(unknownError)
        //
        //             if (parsedError.kind == "http") {
        //                 let errorMessage: string
        //
        //                 if (parsedError.dto?.detailMessage !== undefined) {
        //                     errorMessage = parsedError.dto?.detailMessage
        //                 } else if (parsedError.status === 409) {
        //                     errorMessage = `There is already existing commit.`
        //                 } else if (parsedError.status === 400) {
        //                     errorMessage = "Wrong request!"
        //                 } else {
        //                     errorMessage = "Unexpected response. See logs for details..."
        //                 }
        //
        //                 addAlert("Http error!", "danger", errorMessage, 3_000);
        //             } else {
        //                 console.log(parsedError);
        //                 addAlert("Unknown error!", "danger", "See logs for details...");
        //             }
        //         }
    };

    const [isGuiMode, setIsGuiMode] = useState<boolean>(true);
    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem />
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardBody>
                        <Switch
                            id="simple-switch"
                            label="GUI mode"
                            isChecked={isGuiMode}
                            onChange={(_, v) => { setIsGuiMode(v) }}
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
                            <Grid hasGutter>
                                <GridItem span={3}>Key *</GridItem>
                                <GridItem span={2}>Type *</GridItem>
                                <GridItem span={3}>Default Value *</GridItem>
                                <GridItem span={3}>Description</GridItem>
                                <GridItem span={1} />
                            </Grid>
                            {rows.map((row, index) => (
                                <Grid key={row.id} hasGutter>
                                    <GridItem span={3}>
                                        <TextInput
                                            value={row.key}
                                            onChange={(_, value) => updateRow(index, 'key', value)}
                                            isRequired
                                        />
                                    </GridItem>

                                    <GridItem span={2}>
                                        <FormSelect
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

                                    <GridItem span={3}>
                                        <TextInput
                                            value={row.defaultValue}
                                            onChange={(_, value) => updateRow(index, 'defaultValue', value)}
                                        />
                                    </GridItem>

                                    <GridItem span={3}>
                                        <TextInput
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
                            ))}
                            <Button
                                variant="link"
                                icon={<PlusIcon />}
                                onClick={addRow}
                            >
                                Add property
                            </Button>
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationSchema}>Commit schema</Button>
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
                                code={configuration.jsonSchema ?? ""}
                                language={Language.json}
                                height="400px"
                            />
                        </CardBody>
                        <CardFooter>
                            <Button variant="primary" onClick={handleCommitConfigurationSchema}>Commit schema</Button>
                        </CardFooter>
                    </Card>
                </FlexItem>
            }
        </Flex >
    )
}
