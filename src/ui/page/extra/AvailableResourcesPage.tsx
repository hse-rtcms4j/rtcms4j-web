import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Divider,
    EmptyState,
    Flex,
    FlexItem,
    Page,
    PageSection,
    PageSectionVariants,
    Pagination,
    SearchInput,
    Spinner,
    Tab,
    Tabs,
    TabTitleText,
} from "@patternfly/react-core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { coreApi } from "@/api/client";
import type { PagedModelApplicationDto, PagedModelNamespaceDto } from "@/api/generated";
import namespaceSvg from "/namespace.svg"
import applicationSvg from "/application.svg"
import { buildNamespacePath, buildApplicationPath } from "@/router";
import { AppHeaderBare } from "@/ui/component/AppHeader";

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
                const namespaces = await coreApi.findAvailableNamespaces({
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

function useApplications(name: string | undefined, pageNumber: number, pageSize: number) {
    const [state, setState] = useState<{
        pagedModel: PagedModelApplicationDto | undefined;
        loading: boolean;
    }>({ pagedModel: undefined, loading: true });

    useEffect(() => {
        let cancelled = false;

        setState(s => ({ ...s, loading: true }));

        (async () => {
            try {
                const applications = await coreApi.findAvailableApplications({
                    name,
                    pageable: { page: pageNumber, size: pageSize },
                });
                if (!cancelled) setState({ pagedModel: applications, loading: false });
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

    const [nsInputValue, setNsInputValue] = useState("");
    const [nsSearchTerm, setNsSearchTerm] = useState<string | undefined>(undefined);
    const [nsPage, setNsPage] = useState(1);
    const [nsPerPage, setNsPerPage] = useState(10);
    const namespacesWrapper = useNamespaces(nsSearchTerm, nsPage - 1, nsPerPage);

    const [appInputValue, setAppInputValue] = useState("");
    const [appSearchTerm, setAppSearchTerm] = useState<string | undefined>(undefined);
    const [appPage, setAppPage] = useState(1);
    const [appPerPage, setAppPerPage] = useState(10);
    const applicationsWrapper = useApplications(appSearchTerm, appPage - 1, appPerPage);

    const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
    return (
        <Page masthead={AppHeaderBare()}>
            <PageSection variant={PageSectionVariants.default} isFilled>
                <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                        <Card ouiaId="BasicCard">
                            <CardTitle>Search available namespaces or applications</CardTitle>
                            <CardBody>
                                Currently you do not have global access to all namespaces.
                                You can search for namespaces in which you are granted as administrator or applications in which you are granted as manager.
                            </CardBody>
                        </Card>
                    </FlexItem>
                    <FlexItem>
                        <Tabs
                            activeKey={activeTabKey}
                            onSelect={(_, v) => setActiveTabKey(v)}
                            isBox={true}
                            aria-label="Tabs"
                            role="region"
                        >
                            <Tab eventKey={0} title={<TabTitleText>Namespaces</TabTitleText>}>
                                <Flex direction={{ default: 'column' }}>
                                    <FlexItem />
                                    <FlexItem>
                                        <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} >
                                            <FlexItem>
                                                <SearchInput
                                                    aria-label="Search basic"
                                                    placeholder="Find by namespace name"
                                                    value={nsInputValue}
                                                    onChange={(_event, value) => setNsInputValue(value)}
                                                    onSearch={(_event, value) => {
                                                        setNsPage(1);
                                                        setNsSearchTerm(value);
                                                    }}
                                                    onClear={() => {
                                                        setNsInputValue("");
                                                        setNsPage(1);
                                                        setNsSearchTerm(undefined);
                                                    }}
                                                />
                                            </FlexItem>
                                            <FlexItem>
                                                <Pagination
                                                    widgetId="pagination-top"
                                                    ouiaId="PaginationTop"
                                                    itemCount={namespacesWrapper?.pagedModel?.page?.totalElements ?? 0}
                                                    perPage={nsPerPage}
                                                    page={nsPage}
                                                    onSetPage={(_e, value) => setNsPage(value)}
                                                    onPerPageSelect={(_e, value) => setNsPerPage(value)}
                                                />
                                            </FlexItem>
                                        </Flex>
                                    </FlexItem>
                                    <FlexItem>
                                        <Divider />
                                    </FlexItem>
                                    {namespacesWrapper?.loading ? (
                                        <FlexItem>
                                            <EmptyState titleText="Loading..." headingLevel="h4" icon={Spinner} />
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
                            </Tab>
                            <Tab eventKey={1} title={<TabTitleText>Applications</TabTitleText>}>
                                <Flex direction={{ default: 'column' }}>
                                    <FlexItem />
                                    <FlexItem>
                                        <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} >
                                            <FlexItem>
                                                <SearchInput
                                                    aria-label="Search basic"
                                                    placeholder="Find by application name"
                                                    value={appInputValue}
                                                    onChange={(_event, value) => setAppInputValue(value)}
                                                    onSearch={(_event, value) => {
                                                        setAppPage(1);
                                                        setAppSearchTerm(value);
                                                    }}
                                                    onClear={() => {
                                                        setAppInputValue("");
                                                        setAppPage(1);
                                                        setAppSearchTerm(undefined);
                                                    }}
                                                />
                                            </FlexItem>
                                            <FlexItem>
                                                <Pagination
                                                    widgetId="pagination-top"
                                                    ouiaId="PaginationTop"
                                                    itemCount={applicationsWrapper?.pagedModel?.page?.totalElements ?? 0}
                                                    perPage={appPerPage}
                                                    page={appPage}
                                                    onSetPage={(_e, value) => setAppPage(value)}
                                                    onPerPageSelect={(_e, value) => setAppPerPage(value)}
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
                            </Tab>
                        </Tabs>
                    </FlexItem>
                </Flex>
            </PageSection>
        </Page>
    )
}
