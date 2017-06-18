// jshint maxlen:1024

var assert = require('chai').assert,
    eyo = require('../lib/eyo');

var tests = [
    [
        'Корабль',
        'Корабль'
    ],
    [
        null,
        ''
    ],
    [
        'Ежик',
        'Ёжик'
    ],
    [
        'Ежик\nЕжик\nежик',
        'Ёжик\nЁжик\nёжик'
    ],
    [
        'Емко, остроумно и убедительно.',
        'Ёмко, остроумно и убедительно.'
    ],
    [
        '«Петр I»',
        '«Пётр I»'
    ],
    [
        'ПЕТР',
        'ПЕТР'
    ],
    [
        '«Лед тронулся, господа присяжные заседатели!»',
        '«Лёд тронулся, господа присяжные заседатели!»'
    ],
    [
        'Мед. образование',
        'Мед. образование'
    ],
    [
        'еще',
        'ещё'
    ],
    [
        'Бёрёза, бёреза',
        'Берёза, берёза'
    ],
    [
        'Елочка!',
        'Ёлочка!'
    ],
    [
        'ем',
        'ем'
    ],
    [
        'еж',
        'ёж'
    ],
    [
        'ее',
        'её'
    ],
    [
        'её',
        'её'
    ],
    [
        'нее',
        'неё'
    ],
    [
        'люблю ее',
        'люблю её'
    ],
    [
        'ее!',
        'её!'
    ],
    [
        'Ее',
        'Её'
    ],
    [
        'А ее еще',
        'А её ещё'
    ],
    [
        'люблю ее!',
        'люблю её!'
    ],
    [
        'ее улыбку',
        'её улыбку'
    ],
    [
        'люблю ее улыбку',
        'люблю её улыбку'
    ],
    [
        'Всем, всем, всем!',
        'Всем, всем, всем!'
    ],
    [
        '8. Обновление данных в реальном времени.\n9. Наличие индексов.',
        '8. Обновление данных в реальном времени.\n9. Наличие индексов.'
    ],
    [
        'значения будут соединены.\n',
        'значения будут соединены.\n'
    ],
    [
        '- на дату начала unix-эпохи, сохраняя при этом время.\n',
        '- на дату начала unix-эпохи, сохраняя при этом время.\n'
    ],
    [
        'Если строка содержит набор байт, не являющийся UTF-8, то поведение не определено.\n\n=',
        'Если строка содержит набор байт, не являющийся UTF-8, то поведение не определено.\n\n='
    ],
    [
        '\nЭто сойдет.\n- Два лопуха.\N',
        '\nЭто сойдёт.\n- Два лопуха.\N'
    ]
];

describe('restore', function() {
    this.timeout(15000);

    tests.forEach(function(test) {
        it(test[1], function() {
            assert.equal(eyo.restore(test[0]), test[1]);
        });
    });
});

describe('lint', function() {
    this.timeout(15000);

    it('should return replacement', function() {
        var replacements = eyo.lint('«Лед тронулся, господа присяжные заседатели!»');
        assert.equal(replacements.safe.length, 1);
        assert.equal(replacements.notSafe.length, 0);
    });

    it('should return sorted results', function() {
        var replacements = eyo.lint('елка, Елка, елки, Елка, Береза, Ежик, ежики', true);

        assert.equal(replacements.safe.length, 6);
        assert.equal(replacements.notSafe.length, 0);

        assert.equal(replacements.safe[0].before, 'Береза');
        assert.equal(replacements.safe[1].before, 'Ежик');
        assert.equal(replacements.safe[2].before, 'Елка');
        assert.equal(replacements.safe[3].before, 'ежики');
        assert.equal(replacements.safe[4].before, 'елка');
        assert.equal(replacements.safe[5].before, 'елки');

    });

    it('should return correct positions', function() {
        var replacements = eyo.lint('В лесу родилась елочка.', true);

        assert.equal(replacements.safe.length, 1);

        assert.equal(replacements.safe[0].position[0].line, 1);
        assert.equal(replacements.safe[0].position[0].column, 17);
    });

    it('should return correct positions with new lines', function() {
        var replacements = eyo.lint('В лесу родилась елочка.\nВ лесу родилась елочка.\n', true);

        assert.equal(replacements.safe.length, 1);

        assert.equal(replacements.safe[0].position[0].line, 1);
        assert.equal(replacements.safe[0].position[0].column, 17);

        assert.equal(replacements.safe[0].position[1].line, 2);
        assert.equal(replacements.safe[0].position[1].column, 17);
    });
});
