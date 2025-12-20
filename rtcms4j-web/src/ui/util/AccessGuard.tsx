import React from "react";
import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    Spinner,
} from "@patternfly/react-core";
import BugIcon from '@patternfly/react-icons/dist/esm/icons/bug-icon';
import AccessDenied from "@/ui/AccessDenied";


type AccessState = "checking" | "allowed" | "denied" | "error";

function FullPageSpinner() {
    return (
        <Bullseye>
            <EmptyState titleText="Checking access..." headingLevel="h4" icon={Spinner}>
                <EmptyStateBody>Please, wait.</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}

function ErrorPage() {
    return (
        <Bullseye>
            <EmptyState titleText="Error!" icon={BugIcon}>
                <EmptyStateBody>Check logs for details...</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}

type Props = {
    accessChecker: () => Promise<void>;
    children: React.ReactNode;
};

function getHttpStatus(err: unknown): number | undefined {
    if (typeof err !== "object" || err === null) {
        return undefined;
    }

    if (!("response" in err)) {
        return undefined;
    }
    const response = err.response;

    if (typeof response !== "object" || response === null) {
        return undefined;
    }

    if (!("status" in response)) {
        return undefined;
    }
    const status = response.status;

    if (typeof status !== "number" || status === null) {
        return undefined;
    }

    return status;
}


export default function AccessGuard({ accessChecker, children }: Props) {
    const [state, setState] = React.useState<AccessState>("checking");

    React.useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await accessChecker();
                if (cancelled) return;
                setState("allowed");
            } catch (err) {
                if (cancelled) return;
                const status = getHttpStatus(err);
                console.log(status);

                if (status === 401 || status === 403) {
                    setState("denied");
                } if (status === undefined) {
                    console.log(err);
                    setState("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [accessChecker]);

    if (state === "checking") return <FullPageSpinner />;
    if (state === "denied") return <AccessDenied />;
    if (state === "error") return <ErrorPage />;
    return <>{children}</>;
}
