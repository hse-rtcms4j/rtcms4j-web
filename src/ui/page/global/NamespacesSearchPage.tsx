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
import { useNavigate } from "react-router-dom";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { coreApi } from "@/api/client";
import type { PagedModelNamespaceDto } from "@/api/generated";
import namespaceSvg from "/namespace.svg"
import { buildNamespacePath } from "@/router";

function useNamespaces(name: string | undefined, pageNumber: number, pageSize: number) {
    const [state, setState] = useState<{
        pagedModel: PagedModelNamespaceDto | undefined;
        loading: boolean;
    }>({ pagedModel: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const namespaces = await coreApi.findAllNamespaces({
                    name,
                    pageable: { page: pageNumber, size: pageSize },
                });
                if (!cancelled) setState({ pagedModel: namespaces, loading: false });
            } catch {
                if (!cancelled) setState(s => ({ ...s, loading: false }));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [name, pageNumber, pageSize]);

    return state;
}


export default function NamespacesSearchPage() {
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const namespacesWrapper = useNamespaces(searchTerm, page - 1, perPage);

    return (
        <Flex direction={{ default: 'column' }}>
            <FlexItem>
                <Card ouiaId="BasicCard">
                    <CardTitle>Search namespaces</CardTitle>
                    <CardBody>A namespace is a set of applications restricted for some users and serving program clients. Mainly dedicated to separate development teams' fields.</CardBody>
                </Card>
            </FlexItem>
            <FlexItem>
                <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} >
                    <FlexItem>
                        <SearchInput
                            aria-label="Search basic"
                            placeholder="Find by namespace name"
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
                            itemCount={namespacesWrapper?.pagedModel?.page?.totalElements ?? 0}
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
            {namespacesWrapper?.loading ? (
                <FlexItem>
                    <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner}>
                    </EmptyState>
                </FlexItem>
            ) : namespacesWrapper?.pagedModel?.content?.length === 0 ? (
                <FlexItem>
                    <EmptyState titleText="No namespaces found" headingLevel="h4" icon={CubesIcon} />
                </FlexItem>
            ) : (
                namespacesWrapper?.pagedModel?.content?.map(ns => (
                    <FlexItem key={ns.id}>
                        <Card isCompact isClickable>
                            <CardHeader
                                selectableActions={{
                                    onClickAction: () => { navigate(buildNamespacePath(ns.id)) },
                                    selectableActionAriaLabelledby: 'clickable-card'
                                }}
                            >
                                <CardTitle className="center-title">
                                    <img src={namespaceSvg} className="icon inverted" />
                                    <span>Namespace: {ns.name}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>Description: {ns.description ?? 'no description'}</CardBody>
                        </Card>
                    </FlexItem>
                )
                )
            )
            }
        </Flex>
    )
}
