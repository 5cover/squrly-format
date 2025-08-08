/**
 * squrlyFormat — extended string template formatter.
 *
 * Based on `string-template` by Matt Esch (MIT License).
 * Optional prefix/suffix syntax `{[before]key[after]}` inspired by
 * a fork by Alfonso Gómez-Arzola (https://github.com/agarzola/string-template).
 *
 * Modified and rewritten in TypeScript Scover, 2025.
 */

const nargs = /\{(\[.+?\])?([0-9a-zA-Z]+)(\[.+?\])?\}/g;
const brackets = /^\[|\]$/g;

function squrlyFormat(template: string, arr?: readonly unknown[] | Record<string, unknown>): string;
function squrlyFormat(template: string, ...args: readonly unknown[]): string;
function squrlyFormat(template: string, ...rest: readonly unknown[]): string {
    let args: unknown;
    // Determine args form: object, single array, multiple values, or none
    if (rest.length === 1 && typeof rest[0] === 'object') {
        args = rest[0];
    } else {
        args = rest;
    }

    if (!args?.hasOwnProperty) {
        args = {};
    }

    // Ensure args has hasOwnProperty

    return template.replace(nargs, (match, l: string, key: string, r: string, index: number) => {
        // Handle escape: double-braced placeholders
        const before = template[index - 1];
        const after = template[index + match.length];
        if (before === '{' && after === '}') {
            return key;
        }

        // Fetch value
        const val = Object.prototype.hasOwnProperty.call(args, key)
            ? (args as Record<typeof key, unknown>)[key]
            : null;
        if (val === null || val === undefined) {
            return '';
        }
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        let result = String(val);

        // Apply prefix if present
        if (l) {
            const prefix = l.replace(brackets, '');
            result = prefix + result;
        }
        // Apply suffix if present
        if (r) {
            const suffix = r.replace(brackets, '');
            result = result + suffix;
        }

        return result;
    });
}

export default squrlyFormat;
