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
import type { NamespaceDto, PagedModelApplicationDto } from "@/api/generated/core";
import applicationSvg from "/application.svg"
import { buildApplicationPath } from "@/router";

function useApplications(namespaceId: number, name: string | undefined, pageNumber: number, pageSize: number) {
    const [state, setState] = useState<{
        pagedModel: PagedModelApplicationDto | undefined;
        loading: boolean;
    }>({ pagedModel: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const namespaces = await coreApi.findAllApplications({
                    nid: namespaceId,
                    name,
                    page: pageNumber,
                    size: pageSize,
                });
                if (!cancelled) setState({ pagedModel: namespaces, loading: false });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [namespaceId, name, pageNumber, pageSize]);

    return state;
}


export default function NamespacesSearchPage() {
    const navigate = useNavigate();
    const { namespace } = useRouteLoaderData("namespace-layout") as { globalAccess: boolean, namespace: NamespaceDto };

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const applicationsWrapper = useApplications(namespace.id, searchTerm, page - 1, perPage);

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Search namespace {namespace.name} applications</CardTitle>
                    <CardBody>An application is a container of configurations for serving programs. One program instance expected to access its application configurations.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} >
                    <FlexItem>
                        <SearchInput
                            aria-label="Search basic"
                            placeholder="Find by application name"
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
                            itemCount={applicationsWrapper?.pagedModel?.page?.totalElements ?? 0}
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
            {applicationsWrapper?.loading ? (
                <FlexItem>
                    <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner}>
                    </EmptyState>
                </FlexItem>
            ) : applicationsWrapper?.pagedModel?.content?.length === 0 ? (
                <FlexItem>
                    <EmptyState titleText="No applications found" headingLevel="h4" icon={CubesIcon} />
                </FlexItem>
            ) : (
                applicationsWrapper?.pagedModel?.content?.map(app => (
                    <FlexItem key={app.id}>
                        <Card isCompact isClickable>
                            <CardHeader
                                selectableActions={{
                                    onClickAction: () => navigate(buildApplicationPath(app.namespaceId, app.id)),
                                    selectableActionAriaLabelledby: 'clickable-card'
                                }}
                            >
                                <CardTitle className="center-title">
                                    <img src={applicationSvg} className="icon inverted" />
                                    <span>Application: {app.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>Description: {app.description ?? 'no description'}</CardBody>
                        </Card>
                    </FlexItem>
                )
                )
            )
            }
        </Flex>
    )
}
