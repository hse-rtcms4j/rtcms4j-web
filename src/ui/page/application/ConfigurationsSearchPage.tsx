import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Divider,
    EmptyState,
    Flex,
    FlexItem,
    Pagination,
    SearchInput,
    Spinner,
} from "@patternfly/react-core";
import { useState, useEffect } from "react";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { coreApi } from "@/api/client";
import type { ApplicationDto, NamespaceDto, PagedModelConfigurationDto } from "@/api/generated/core";
import configurationSvg from "/configuration.svg"
import { buildConfigurationPath } from "@/router";

function useConfigurations(namespaceId: number, applicationId: number, name: string | undefined, pageNumber: number, pageSize: number) {
    const [state, setState] = useState<{
        pagedModel: PagedModelConfigurationDto | undefined;
        loading: boolean;
    }>({ pagedModel: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const configurations = await coreApi.findAllConfigurations({
                    nid: namespaceId,
                    aid: applicationId,
                    name,
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
    }, [namespaceId, applicationId, name, pageNumber, pageSize]);

    return state;
}


export default function NamespacesSearchPage() {
    const navigate = useNavigate();
    const { namespaceId, application } = useRouteLoaderData("application-layout") as { globalAccess: boolean, namespaceId: number, namespace: NamespaceDto | undefined, application: ApplicationDto };

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const configurationsWrapper = useConfigurations(namespaceId, application.id, searchTerm, page - 1, perPage);

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Search application {application.name} configurations</CardTitle>
                    <CardBody>A configuration is a fixed state of key-value properties. One program instance can contain multiple configurations and their states.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} >
                    <FlexItem>
                        <SearchInput
                            aria-label="Search basic"
                            placeholder="Find by configuration name"
                            value={inputValue}
                            onChange={(_event, value) => setInputValue(value)}
                            onSearch={(_event, value) => {
                                setPage(1);
                                setSearchTerm(value);
                            }}
                            onClear={() => {
                                setInputValue("");
                                setPage(1);
                                setSearchTerm(undefined);
                            }}
                        />
                    </FlexItem>
                    <FlexItem>
                        <Pagination
                            widgetId="pagination-top"
                            ouiaId="PaginationTop"
                            itemCount={configurationsWrapper?.pagedModel?.page?.totalElements ?? 0}
                            perPage={perPage}
                            page={page}
                            onSetPage={(_e, value) => setPage(value)}
                            onPerPageSelect={(_e, value) => setPerPage(value)}
                        />
                    </FlexItem>
                </Flex>
            </FlexItem>
            <FlexItem>
                <Divider />
            </FlexItem>
            {configurationsWrapper?.loading ? (
                <FlexItem>
                    <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner} />
                </FlexItem>
            ) : configurationsWrapper?.pagedModel?.content?.length === 0 ? (
                <FlexItem>
                    <EmptyState titleText="No configurations found" headingLevel="h4" icon={CubesIcon} />
                </FlexItem>
            ) : (
                configurationsWrapper?.pagedModel?.content?.map(cfg => (
                    <FlexItem key={cfg.id}>
                        <Card isCompact isClickable>
                            <CardHeader
                                selectableActions={{
                                    onClickAction: () => navigate(buildConfigurationPath(cfg.namespaceId, cfg.applicationId, cfg.id)),
                                    selectableActionAriaLabelledby: 'clickable-card'
                                }}
                            >
                                <CardTitle className="center-title">
                                    <img src={configurationSvg} className="icon inverted" />
                                    <span>Configuration: {cfg.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>Version: {cfg.commitVersion ?? "not present"}</CardBody>
                        </Card>
                    </FlexItem>
                )
                )
            )
            }
        </Flex>
    )
}
