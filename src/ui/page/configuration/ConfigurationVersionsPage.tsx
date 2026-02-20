import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Divider,
    EmptyState,
    Flex,
    FlexItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Pagination,
    Spinner,
    Timestamp,
    Tooltip,
} from "@patternfly/react-core";
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    TableText,
} from "@patternfly/react-table";
import { useRevalidator, useRouteLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import RedoIcon from '@patternfly/react-icons/dist/esm/icons/redo-icon';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import type { ApplicationDto, ConfigurationDetailedDto, NamespaceDto, PagedModelConfigurationCommitDto } from "@/api/generated/core";
import { useToast } from "@/ui/util/alerts-anchor";
import { coreApi } from "@/api/client";
import parseApiFetchError from "@/api/error-handler";
import { CodeEditor, Language } from "@patternfly/react-code-editor";
import SyncIcon from "@patternfly/react-icons/dist/esm/icons/sync-icon";
import CubesIcon from "@patternfly/react-icons/dist/esm/icons/cubes-icon";

type SelectedCommit = {
    id: number;
    version: string;
    jsonSchema: string;
    jsonValues: string;
};

function prettifyJson(jsonString: string | undefined) {
    if (jsonString == undefined || jsonString.length == 0) {
        return "";
    } else {
        return JSON.stringify(JSON.parse(jsonString), null, 2);
    }
}

function useConfigurationCommits(namespaceId: number, applicationId: number, configurationId: number, pageNumber: number, pageSize: number, refreshKey: number) {
    const [state, setState] = useState<{
        pagedModel: PagedModelConfigurationCommitDto | undefined;
        loading: boolean;
    }>({ pagedModel: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const configurations = await coreApi.getConfigurationCommits({
                    nid: namespaceId,
                    aid: applicationId,
                    cid: configurationId,
                    pageable: { page: pageNumber, size: pageSize },
                });
                if (!cancelled) setState({ pagedModel: configurations, loading: false });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [namespaceId, applicationId, configurationId, pageNumber, pageSize, refreshKey]);

    return state;
}


export default function NamespaceAdminsPage() {
    const revalidator = useRevalidator();
    const { addAlert } = useToast();
    const { namespaceId, application, configuration } = useRouteLoaderData("configuration-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto, configuration: ConfigurationDetailedDto };

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [refreshKey, setRefreshKey] = useState(0);
    const commitsWrapper = useConfigurationCommits(namespaceId, application.id, configuration.id, page - 1, perPage, refreshKey);

    const [selectedCommit, setSelectedCommit] = useState<SelectedCommit>({
        id: -1,
        version: "unknown",
        jsonSchema: "",
        jsonValues: "",
    });

    const [isRollbackModalVisible, setRollbackModalVisible] = useState(false);
    const openRollbackModal = () => setRollbackModalVisible(true);
    const closeRollbackModal = () => setRollbackModalVisible(false);

    const [isShowModalVisible, setShowModalVisible] = useState(false);
    const openShowModal = () => setShowModalVisible(true);
    const closeShowModal = () => setShowModalVisible(false);

    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const openDeleteModal = () => setDeleteModalVisible(true);
    const closeDeleteModal = () => setDeleteModalVisible(false);

    const selectCommit = async (commitId: number) => {
        if (selectedCommit != undefined && selectedCommit.id == commitId) {
            return true;
        }

        try {
            const response = await coreApi.getConfigurationCommit({ nid: namespaceId, aid: application.id, cid: configuration.id, ctid: commitId });
            setSelectedCommit({
                id: response.commitId,
                version: response.commitVersion,
                jsonSchema: response.jsonSchema,
                jsonValues: response.jsonValues,
            });

            return true;
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

            return false;
        }
    };

    const openRollbackModalByCommitId = async (commitId: number) => {
        if (await selectCommit(commitId)) {
            openRollbackModal();
        }
    };

    const openShowModalByCommitId = async (commitId: number) => {
        if (await selectCommit(commitId)) {
            openShowModal();
        }
    };

    const openDeleteModalByCommitId = async (commitId: number) => {
        if (await selectCommit(commitId)) {
            openDeleteModal();
        }
    };

    const rollbackCommit = async (commitId: number) => {
        try {
            await coreApi.applyConfigurationCommit({ nid: namespaceId, aid: application.id, cid: configuration.id, ctid: commitId });

            addAlert("Success!", "success", `Switched to commit ${commitId}.`, 2_000);
            revalidator.revalidate();
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

    const deleteCommit = async (commitId: number) => {
        try {
            await coreApi.deleteConfigurationCommit({ nid: namespaceId, aid: application.id, cid: configuration.id, ctid: commitId });

            addAlert("Success!", "success", `Deleted commit ${commitId}.`, 2_000);
            setRefreshKey(v => v + 1);
            revalidator.revalidate();
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
                    <CardHeader
                        hasWrap
                        actions={{
                            hasNoOffset: true,
                            actions: [
                                <Button
                                    variant="link"
                                    aria-label="Refresh"
                                    onClick={() => setRefreshKey(v => v + 1)}
                                    icon={<SyncIcon />}
                                >Refresh</Button>
                            ]
                        }}
                    >
                        <CardTitle>Configuration {configuration.name} versions</CardTitle>
                    </CardHeader>
                    <CardBody>A configuration version is a fixed state of key-value properties.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Pagination
                    widgetId="pagination-top"
                    ouiaId="PaginationTop"
                    itemCount={commitsWrapper?.pagedModel?.page?.totalElements ?? 0}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_e, value) => setPage(value)}
                    onPerPageSelect={(_e, value) => setPerPage(value)}
                />
            </FlexItem>
            <FlexItem>
                <Divider />
            </FlexItem>
            <FlexItem>
                {
                    commitsWrapper?.loading ? (
                        <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner} />
                    ) : commitsWrapper?.pagedModel?.content?.length === 0 ? (
                        <EmptyState titleText="No versions present..." headingLevel="h4" icon={CubesIcon} />
                    ) : (
                        <Table aria-label="Table">
                            <Thead>
                                <Tr>
                                    <Th>Timestamp</Th>
                                    <Th>Version</Th>
                                    <Th>Description</Th>
                                    <Th>Author</Th>
                                    <Th screenReaderText="Rollback action" />
                                    <Th screenReaderText="Manage action" />
                                    <Th screenReaderText="Delete action" />
                                </Tr>
                            </Thead>
                            <Tbody>
                                {commitsWrapper?.pagedModel?.content?.map(commit => (
                                    <Tr key={commit.commitId}>
                                        <Td modifier="fitContent"><Timestamp date={new Date(commit.createdAt)} /></Td>
                                        <Td>{commit.commitVersion}{configuration.commitVersion == commit.commitVersion ? " (current)" : ""}</Td>
                                        <Td>Commit({commit.commitId}) for schema({commit.commitSchemaId}).</Td>
                                        <Td>
                                            <Tooltip content={<div>{commit.sourceIdentity}</div>}><div>{commit.sourceType.toString()}</div></Tooltip>
                                        </Td>
                                        <Td modifier="fitContent" hasAction>
                                            {configuration.commitVersion != commit.commitVersion ?
                                                <TableText>
                                                    <Button variant="primary" icon={<RedoIcon />} onClick={() => openRollbackModalByCommitId(commit.commitId)}>
                                                        Rollback
                                                    </Button>
                                                </TableText>
                                                : ""
                                            }
                                        </Td>
                                        <Td modifier="fitContent" hasAction>
                                            {<TableText>
                                                <Button variant="link" icon={<SearchIcon />} onClick={() => openShowModalByCommitId(commit.commitId)}>
                                                    Show details
                                                </Button>
                                            </TableText>}
                                        </Td>
                                        <Td modifier="fitContent" hasAction>
                                            {configuration.commitVersion != commit.commitVersion ?
                                                <TableText>
                                                    <Button variant="danger" icon={<TimesIcon />} onClick={() => openDeleteModalByCommitId(commit.commitId)}>
                                                        Delete
                                                    </Button>
                                                </TableText>
                                                : ""
                                            }
                                        </Td>
                                    </Tr>
                                ))
                                }
                            </Tbody>
                        </Table>
                    )
                }
                <Modal
                    variant="small"
                    isOpen={isRollbackModalVisible}
                    onClose={closeRollbackModal}
                >
                    <ModalHeader title={`Rollback ${configuration.name} version ${selectedCommit.version}?`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        Current version {configuration.commitVersion} will be replaced with {selectedCommit.version}.
                        <br />
                        Version {configuration.commitVersion} will not be deleted.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="primary" onClick={() => { rollbackCommit(selectedCommit.id); closeRollbackModal(); }}>
                            Rollback {selectedCommit.version} version
                        </Button>
                        <Button key="cancel" variant="link" onClick={closeRollbackModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal
                    variant="small"
                    isOpen={isShowModalVisible}
                    onClose={closeShowModal}
                >
                    <ModalHeader title={`Configuration ${configuration.name} version ${selectedCommit.version}`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        <CodeEditor
                            headerMainContent="Json schema"
                            isLanguageLabelVisible
                            isDarkTheme={true}
                            isLineNumbersVisible={true}
                            isReadOnly={true}
                            isMinimapVisible={false}
                            code={prettifyJson(selectedCommit.jsonSchema)}
                            language={Language.json}
                            height="400px"
                        />
                        <CodeEditor
                            headerMainContent="Json values"
                            isLanguageLabelVisible
                            isDarkTheme={true}
                            isLineNumbersVisible={true}
                            isReadOnly={true}
                            isMinimapVisible={false}
                            code={prettifyJson(selectedCommit.jsonValues)}
                            language={Language.json}
                            height="400px"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button key="cancel" variant="link" onClick={closeShowModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal
                    variant="small"
                    isOpen={isDeleteModalVisible}
                    onClose={closeDeleteModal}
                >
                    <ModalHeader title={`Delete ${configuration.name} version ${selectedCommit.version}?`} labelId="variant-modal-title" />
                    <ModalBody id="modal-box-body-variant">
                        Configuration version {selectedCommit.version} will be permanently deleted.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="danger" onClick={() => { deleteCommit(selectedCommit.id); closeDeleteModal(); }}>
                            Delete {selectedCommit.version} version!
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
