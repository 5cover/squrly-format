import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import squrlyFormat from '../src/index.js';

await describe('squrlyFormat', async () => {
    await it('Named arguments are replaced', () => {
        const result = squrlyFormat('Hello {name}, how are you?', { name: 'Mark' });
        assert.equal(result, 'Hello Mark, how are you?');
    });

    await it('Named arguments at the start of strings are replaced', () => {
        const result = squrlyFormat('{likes} people have liked this', {
            likes: 123,
        });

        assert.equal(result, '123 people have liked this');
    });

    await it('Named arguments at the end of string are replaced', () => {
        const result = squrlyFormat('Please respond by {date}', {
            date: '01/01/2015',
        });

        assert.equal(result, 'Please respond by 01/01/2015');
    });

    await it('Multiple named arguments are replaced', () => {
        const result = squrlyFormat('Hello {name}, you have {emails} new messages', {
            name: 'Anna',
            emails: 5,
        });

        assert.equal(result, 'Hello Anna, you have 5 new messages');
    });

    await it('Missing named arguments become 0 characters', () => {
        const result = squrlyFormat('Hello{name}, how are you?', {});
        assert.equal(result, 'Hello, how are you?');
    });

    await it('Named arguments can be escaped', () => {
        const result = squrlyFormat('Hello {{name}}, how are you?', { name: 'Mark' });
        assert.equal(result, 'Hello {name}, how are you?');
    });

    await it('Array arguments are replaced', () => {
        const result = squrlyFormat('Hello {0}, how are you?', ['Mark']);
        assert.equal(result, 'Hello Mark, how are you?');
    });

    await it('Array arguments at the start of strings are replaced', () => {
        const result = squrlyFormat('{0} people have liked this', [123]);

        assert.equal(result, '123 people have liked this');
    });

    await it('Array arguments at the end of string are replaced', () => {
        const result = squrlyFormat('Please respond by {0}', ['01/01/2015']);

        assert.equal(result, 'Please respond by 01/01/2015');
    });

    await it('Multiple array arguments are replaced', () => {
        const result = squrlyFormat('Hello {0}, you have {1} new messages', ['Anna', 5]);

        assert.equal(result, 'Hello Anna, you have 5 new messages');
    });

    await it('Missing array arguments become 0 characters', () => {
        const result = squrlyFormat('Hello{0}, how are you?', []);
        assert.equal(result, 'Hello, how are you?');
    });

    await it('Array arguments can be escaped', () => {
        const result = squrlyFormat('Hello {{0}}, how are you?', ['Mark']);
        assert.equal(result, 'Hello {0}, how are you?');
    });

    await it('Array keys are not accessible', () => {
        const result = squrlyFormat('Function{splice}', []);
        assert.equal(result, 'Function');
    });

    await it('Listed arguments are replaced', () => {
        const result = squrlyFormat('Hello {0}, how are you?', 'Mark');
        assert.equal(result, 'Hello Mark, how are you?');
    });

    await it('Listed arguments at the start of strings are replaced', () => {
        const result = squrlyFormat('{0} people have liked this', 123);

        assert.equal(result, '123 people have liked this');
    });

    await it('Listed arguments at the end of string are replaced', () => {
        const result = squrlyFormat('Please respond by {0}', '01/01/2015');

        assert.equal(result, 'Please respond by 01/01/2015');
    });

    await it('Multiple listed arguments are replaced', () => {
        const result = squrlyFormat('Hello {0}, you have {1} new messages', 'Anna', 5);

        assert.equal(result, 'Hello Anna, you have 5 new messages');
    });

    await it('Missing listed arguments become 0 characters', () => {
        const result = squrlyFormat('Hello{1}, how are you?', 'no');
        assert.equal(result, 'Hello, how are you?');
    });

    await it('Listed arguments can be escaped', () => {
        const result = squrlyFormat('Hello {{0}}, how are you?', 'Mark');
        assert.equal(result, 'Hello {0}, how are you?');
    });

    await it('Allow null data', () => {
        const result = squrlyFormat('Hello{0}', null);
        assert.equal(result, 'Hello');
    });

    await it('Allow undefined data', () => {
        const result1 = squrlyFormat('Hello{0}');
        const result2 = squrlyFormat('Hello{0}', undefined);
        assert.equal(result1, 'Hello');
        assert.equal(result2, 'Hello');
    });

    await it('Null keys become 0 characters', () => {
        const result1 = squrlyFormat('Hello{name}', { name: null });
        const result2 = squrlyFormat('Hello{0}', [null]);
        const result3 = squrlyFormat('Hello{0}{1}{2}', null, null, null);
        assert.equal(result1, 'Hello');
        assert.equal(result2, 'Hello');
        assert.equal(result3, 'Hello');
    });

    await it('Undefined keys become 0 characters', () => {
        const result1 = squrlyFormat('Hello{firstName}{lastName}', { name: undefined });
        const result2 = squrlyFormat('Hello{0}{1}', [undefined]);
        const result3 = squrlyFormat('Hello{0}{1}{2}', undefined, undefined);
        assert.equal(result1, 'Hello');
        assert.equal(result2, 'Hello');
        assert.equal(result3, 'Hello');
    });

    await it('Works across multline strings', () => {
        const result1 = squrlyFormat('{zero}\n{one}\n{two}', {
            zero: 'A',
            one: 'B',
            two: 'C',
        });
        const result2 = squrlyFormat('{0}\n{1}\n{2}', ['A', 'B', 'C']);
        const result3 = squrlyFormat('{0}\n{1}\n{2}', 'A', 'B', 'C');
        assert.equal(result1, 'A\nB\nC');
        assert.equal(result2, 'A\nB\nC');
        assert.equal(result3, 'A\nB\nC');
    });

    await it('Allow multiple references', () => {
        const result1 = squrlyFormat('{a}{b}{c}\n{a}{b}{c}\n{a}{b}{c}', {
            a: 'one',
            b: 'two',
            c: 'three',
        });
        const result2 = squrlyFormat('{0}{1}{2}\n{0}{1}{2}\n{0}{1}{2}', ['one', 'two', 'three']);
        const result3 = squrlyFormat('{0}{1}{2}\n{0}{1}{2}\n{0}{1}{2}', 'one', 'two', 'three');
        assert.equal(result1, 'onetwothree\nonetwothree\nonetwothree');
        assert.equal(result2, 'onetwothree\nonetwothree\nonetwothree');
        assert.equal(result3, 'onetwothree\nonetwothree\nonetwothree');
    });

    await it('Attach strings to variables in template (with object)', () => {
        const result1 = squrlyFormat('Hello{[, ]name}!', {
            name: 'Mark',
        });
        const result2 = squrlyFormat('Hello, {name[ San]}!', {
            name: 'Mark',
        });
        const result3 = squrlyFormat('Hello{[, my name is ]name[ and I like JavaScript]}!', {
            name: 'Mark',
        });
        const result4 = squrlyFormat('Hello{[, ]name}!', {
            someotherkey: 'Mark',
        });
        assert.equal(result1, 'Hello, Mark!');
        assert.equal(result2, 'Hello, Mark San!');
        assert.equal(result3, 'Hello, my name is Mark and I like JavaScript!');
        assert.equal(result4, 'Hello!');
    });

    await it('Attach strings to variables in template (with array)', () => {
        const result1 = squrlyFormat('Hello{[, ]0}!', ['Mark']);
        const result2 = squrlyFormat('Hello, {0[ San]}!', ['Mark']);
        const result3 = squrlyFormat('Hello{[, my name is ]0[ and I like JavaScript]}!', ['Mark']);
        const result4 = squrlyFormat('Hello{[, ]0}!', []);
        assert.equal(result1, 'Hello, Mark!');
        assert.equal(result2, 'Hello, Mark San!');
        assert.equal(result3, 'Hello, my name is Mark and I like JavaScript!');
        assert.equal(result4, 'Hello!');
    });

    await it('Attach strings to variables in template (with list of arguments)', () => {
        const result1 = squrlyFormat('Hello{[, ]0}!', 'Mark');
        const result2 = squrlyFormat('Hello, {0[ San]}!', 'Mark');
        const result3 = squrlyFormat('Hello{[, my name is ]0[ and I like JavaScript]}!', 'Mark');
        const result4 = squrlyFormat('Hello{[, ]0}!');
        assert.equal(result1, 'Hello, Mark!');
        assert.equal(result2, 'Hello, Mark San!');
        assert.equal(result3, 'Hello, my name is Mark and I like JavaScript!');
        assert.equal(result4, 'Hello!');
    });

    await it('Attach strings to multiple mixed variables in a template', () => {
        const result1 = squrlyFormat(
            'Hello{[, ]name}! You have {msgCount} new messages.{[ There are ]issueCount[ new issues.]}',
            {
                name: 'Mark',
                msgCount: 3,
                issueCount: 7,
            }
        );
        assert.equal(result1, 'Hello, Mark! You have 3 new messages. There are 7 new issues.');
    });

    await it('Allow square brackets inside an attached string', () => {
        const result1 = squrlyFormat('Hello{[, [ ]]0}!', 'Mark');
        assert.equal(result1, 'Hello, [ ]Mark!');
    });
});
