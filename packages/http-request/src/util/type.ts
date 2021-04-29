/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
export function isURLSearchParams(val: unknown): boolean {
    return (
        typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
    );
}
