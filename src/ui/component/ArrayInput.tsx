import { Button, Flex, FlexItem, FormHelperText, FormSelect, FormSelectOption, HelperText, HelperTextItem, TextInput } from "@patternfly/react-core";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import { useState } from "react";

type ArrayInputProps = {
    id: string;
    type: string | undefined;
    enumValues?: string[];
    value: any;
    onChange: (newValue: any) => void;
};

export default function ArrayInput({ id, type, enumValues, value, onChange }: ArrayInputProps) {
    const defaultValue = (type === 'integer' || type === 'number') ? '0' : (type === 'boolean') ? 'false' : '';

    const [items, setItems] = useState<string[]>(
        Array.isArray(value) ? value.map(String) : []
    );

    const updateItem = (itemIndex: number, newValue: string) => {
        const newItems = items.map((item, i) => i === itemIndex ? newValue : item);
        setItems(newItems);
        onChange(newItems);
    };

    const addItem = () => {
        const newItem = enumValues && enumValues.length > 0 ? enumValues[0] : defaultValue;
        const newItems = [...items, newItem];
        setItems(newItems);
        onChange(newItems);
    };

    const removeItem = (itemIndex: number) => {
        const newItems = items.filter((_, i) => i !== itemIndex);
        setItems(newItems);
        onChange(newItems);
    };

    const renderArrayItem = (itemValue: string, itemIndex: number) => {
        if (enumValues && enumValues.length > 0) {
            return (
                <FormSelect
                    id={`${id}_item_${itemIndex}`}
                    value={itemValue}
                    onChange={(_, newValue) => updateItem(itemIndex, newValue)}
                    key={itemIndex}
                >
                    {enumValues.map((enumVal) => (
                        <FormSelectOption key={enumVal} value={enumVal} label={enumVal} />
                    ))}
                </FormSelect>
            );
        }
        if (type === 'integer' || type === 'number') {
            const value = itemValue ?? '';
            let validatedState: "error" | "default" | "success" | "warning" | undefined = "default";
            let errorText = '';

            const num = parseFloat(value);
            if (isNaN(num)) {
                validatedState = "error";
                errorText = 'Must be a valid number';
            } else if (type === 'integer' && !Number.isInteger(num)) {
                validatedState = "error";
                errorText = 'Must be an integer';
            }

            return (
                <>
                    <TextInput
                        id={`${id}_item_${itemIndex}`}
                        value={itemValue}
                        type="number"
                        validated={validatedState}
                        onChange={(_, newValue) => updateItem(itemIndex, newValue)}
                        key={itemIndex}
                    />
                    {validatedState === 'error' ? (
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
                                    {errorText}
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    ) : ''}
                </>
            );
        }

        if (type === 'boolean') {
            return (
                <FormSelect
                    id={`${id}_item_${itemIndex}`}
                    value={itemValue}
                    onChange={(_, newValue) => updateItem(itemIndex, newValue)}
                    key={itemIndex}
                >
                    <FormSelectOption value="true" label="true" />
                    <FormSelectOption value="false" label="false" />
                </FormSelect>
            );
        }

        return (
            <TextInput
                id={`${id}_item_${itemIndex}`}
                value={itemValue}
                onChange={(_, newValue) => updateItem(itemIndex, newValue)}
                key={itemIndex}
            />
        );
    };

    return (
        <Flex direction={{ default: 'column' }}>
            {items.map((item, itemIndex) => (
                <FlexItem key={itemIndex}>
                    <Flex>
                        <FlexItem style={{ flex: 1 }}>
                            {renderArrayItem(item, itemIndex)}
                        </FlexItem>
                        <FlexItem>
                            <Button
                                variant="plain"
                                onClick={() => removeItem(itemIndex)}
                                aria-label="Remove item"
                            >
                                ✕
                            </Button>
                        </FlexItem>
                    </Flex>
                </FlexItem>
            ))}
            <FlexItem>
                <Button variant="secondary" onClick={addItem} size="sm">
                    + Add item
                </Button>
            </FlexItem>
        </Flex>
    );
}
