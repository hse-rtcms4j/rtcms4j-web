import React from "react";
import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    Spinner,
} from "@patternfly/react-core";
import BugIcon from '@patternfly/react-icons/dist/esm/icons/bug-icon';
import NetworkIcon from '@patternfly/react-icons/dist/esm/icons/network-icon';
import AccessDenied from "@/ui/AccessDenied";
import parseApiFetchError from "@/api/error-handler";


type AccessState = "checking" | "allowed" | "denied" | "network-error" | "unknown-error";

function FullPageSpinner() {
    return (
        <Bullseye>
            <EmptyState titleText="Checking access..." headingLevel="h4" icon={Spinner}>
                <EmptyStateBody>Please, wait.</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}

function NetworkErrorPage() {
    return (
        <Bullseye>
            <EmptyState titleText="Network error!" icon={NetworkIcon}>
                <EmptyStateBody>Unable to reach the server! Try again later...</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}

function UnknownErrorPage() {
    return (
        <Bullseye>
            <EmptyState titleText="Unknown error!" icon={BugIcon}>
                <EmptyStateBody>Check logs for details...</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}

type Props = {
    accessChecker: () => Promise<void>;
    children: React.ReactNode;
};

export default function AccessGuard({ accessChecker, children }: Props) {
    const [state, setState] = React.useState<AccessState>("checking");

    React.useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await accessChecker();
                if (cancelled) return;
                setState("allowed");
            } catch (unknownError) {
                if (cancelled) return;
                const parsedError = await parseApiFetchError(unknownError)

                if (parsedError.kind == "http") {
                    if (parsedError.status === 401 || parsedError.status === 403) {
                        setState("denied");
                    }
                } else if (parsedError.kind == "network") {
                    setState("network-error");
                } else {
                    console.log(parsedError);
                    setState("unknown-error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [accessChecker]);

    if (state === "checking") return <FullPageSpinner />;
    if (state === "denied") return <AccessDenied />;
    if (state === "network-error") return <NetworkErrorPage />;
    if (state === "unknown-error") return <UnknownErrorPage />;

    return <>{children}</>;
}
