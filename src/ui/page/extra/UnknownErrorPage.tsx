import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
} from "@patternfly/react-core";
import BugIcon from '@patternfly/react-icons/dist/esm/icons/bug-icon';

export default function UnknownErrorPage() {
    return (
        <Bullseye>
            <EmptyState titleText="Unknown error!" icon={BugIcon}>
                <EmptyStateBody>Check logs for details...</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}
