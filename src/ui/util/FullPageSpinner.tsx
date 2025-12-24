import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    Spinner,
} from "@patternfly/react-core";

export default function FullPageSpinner() {
    return (
        <Bullseye>
            <EmptyState titleText="Checking access..." headingLevel="h4" icon={Spinner}>
                <EmptyStateBody>Please, wait.</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}
