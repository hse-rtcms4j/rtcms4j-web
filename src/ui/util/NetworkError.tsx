import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
} from "@patternfly/react-core";
import NetworkIcon from '@patternfly/react-icons/dist/esm/icons/network-icon';

export default function NetworkErrorPage() {
    return (
        <Bullseye>
            <EmptyState titleText="Network error!" icon={NetworkIcon}>
                <EmptyStateBody>Unable to reach the server! Try again later...</EmptyStateBody>
            </EmptyState>
        </Bullseye>
    );
}
