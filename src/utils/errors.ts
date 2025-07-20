export function flattenErrors(errors: unknown): string[] {
    if (Array.isArray(errors)) {
        return errors.flatMap(flattenErrors);
    }  else if (typeof errors === 'object' && errors !== null) {
        const errorObject = errors as Record<string, any>;
        
        // Handle objects with message property directly
        if (errorObject.message) {
            return [errorObject.message, ...flattenErrors(errorObject.data || {})];
        }
        
        // Handle nested objects with code/message structure
        if (errorObject.data) {
            const messages: string[] = [];
            
            for (const key in errorObject.data) {
                const value = errorObject.data[key];
                if (typeof value === 'object' && value !== null) {
                    // Always recursively process the value to extract all messages
                    messages.push(...flattenErrors(value));
                }
            }
            
            if (messages.length > 0) {
                return messages;
            }
        }
        
        // Process all object values recursively
        return Object.values(errorObject).flatMap(flattenErrors);
    } else if (typeof errors === 'string') {
        return [errors];
    } else {
        return [];
    }
}

export function pocketbaseErrorMessage(errors: unknown): string {
    const messages = flattenErrors(errors);
    return messages.length > 0 ? messages.join('\n') : 'No errors found';
}
