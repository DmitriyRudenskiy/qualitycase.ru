class Highlighter {
    constructor() {
        this._totalCommands = this._getCommands();
    }

    handle(str, mode) {
        let commands = this._totalCommands[mode];

        str = this._decodeHtmlSpecialChars(str);
        str = this._addSoftLineBreaks(str);

        // костыль
        str = str.replace(/<\?php/g, '%?');
        str = str.replace(/<\?=/g, '%?=');
        str = str.replace(/\?>/g, '?%');

        str = this._merge(this._tokenize({str, commands, mode}));
        str = this._addLineNumbers(str);

        // костыль
        str = str.replace(/%\?=/g, '&lt;?=');
        str = str.replace(/%\?/g, '&lt;?php');
        str = str.replace(/\?%/g, '?&gt;');

        // костыль
        str = str.replace(/\/\/!!/g, '//');

        return str;
    }

    _addSoftLineBreaks(str) {
        let points = [
            ' = ', ' \\. ', ', ', ' \\+ ', ' - ', ' \\* ', ' [^<]\\/ ', ' % ', ' && ', ' or ', ' and ',
            ' \\|\\| ', ' >= ', ' <= ', ' != ', '>', '[^/][^/] ', '\\(', '=', '\\[', '"', "'",
        ];

        let lines = str.split('\n');

        for (let i = 0; i < lines.length; i++) {
            //lines[i] = lines[i] + lines[i].length;

            let rowNum = 25;
            let line = lines[i];
            let result = '';

            if (lines[i].length > 27) {

                let cutLength;
                if (lines[i].length < 90) {
                    cutLength = 25;
                } else {
                    cutLength = 20;
                }

                whileLoop:
                    while (line.length > cutLength) {
                        for (let point of points) {
                            let regExp = new RegExp('^(.{' + (cutLength - 10) + '}.{0,10}?' + point + ')(.{2,})$', 'i');
                            let match = line.match(regExp);

                            if (match) {
                                result += match[1] + '---';
                                line = match[2];

                                continue whileLoop;
                            }
                        }

                        let regExp = new RegExp('^(.{' + cutLength + '})(.*)$');
                        let match = line.match(regExp);

                        result += match[1] + '---';
                        line = match[2];
                        continue whileLoop;
                    }

                if (line.length > 0) {
                    lines[i] = result + line;
                } else {
                    lines[i] = result;
                }
            }
        }

        return lines.join('\n');
    }

    _addLineNumbers(str) {
        let lines = str.split('\n');
        let result = [];

        for (let i = 0; i < lines.length; i++) {
            let tabs = this._getTabs(lines[i]);
            lines[i] = this._handleSoftLineBreaks(lines[i], tabs);

            result.push('<span class="line-number"></span>' + lines[i]);
        }
        str = result.join('\n');

        return str;
    }

    _handleSoftLineBreaks(str, tabs) {
        let match = str.match(/---/g);

        if (match) {
            let iters = match.length;

            for (let i = 1; i <= iters; i++) {
                str = str.replace(/---/, '<span class="break break-' + i + '-of-' + iters + '"><br><span>' + tabs + '&#9;</span></span>');
            }

            str += '<span class="break break-gap-of-' + iters + '">&nbsp;</span>';
        }

        return str;
    }

    _getTabs(str) {
        let tabs;
        let match = str.match(/\t*/);

        if (match[0].length > 0) {
            tabs = '&#9;'.repeat(match[0].length);
        } else {
            tabs = '';
        }

        return tabs;
    }

    _merge(tokens) {
        let result = '';

        for (let token of tokens) {
            if (token.inside) {

                result += '<span class="token token-' + token.mode + ' token-' + token.type + '">' + this._merge(token.inside) + '</span>';
            } else {
                let match = this._encodeHtmlSpecialChars(token.match);

                if ((token.type != 'undefined' && token.type != '~') && token.type != 'ignore') {
                    result += '<span class="token token-' + token.mode + ' token-' + token.type + '">' + match + '</span>';
                } else {
                    result += match;
                }
            }
        }
        ;

        return result;
    }

    _decodeHtmlSpecialChars(str) {
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');

        return str;
    }

    _encodeHtmlSpecialChars(str) {
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');

        return str;
    }

    _tokenize(options) {
        let {commands, str, mode} = options;

        let lastIndex = 0;
        let tokens = [];

        if (commands[0].type != 'ignore') {
            commands.unshift({
                type: 'ignore',
                match: /---|~~~|@@@/,
            });
        }
        if (commands[commands.length - 1].type != 'undefined') {
            commands.push({
                type: 'undefined',
                match: /[\s\S]/,
            });
        }

        while (lastIndex < str.length) {
            for (let command of commands) {

                let regExp = new RegExp(command.match, command.match.flags + 'y');
                regExp.lastIndex = lastIndex;
                let pockets = regExp.exec(str);

                if (pockets) {
                    let match = pockets[0];

                    if (this._checkVicinity(command, str, match, lastIndex)) {

                        let token = {type: command.type, match, mode};

                        if (command.explode) {
                            token.inside = this._tokenizeExplode(command.explode, pockets, mode);

                        } else if (command.inside || command.mode) {
                            token.inside = this._tokenizeInside(command, match, mode);
                        }

                        tokens.push(token);

                        lastIndex += match.length - 1;
                        break;
                    }
                }
            }

            lastIndex++;
        }

        return tokens;
    }

    // Нелья уносить в основную функцию, тк ее использует _tokenizeExplode
    _tokenizeInside(command, str, mode) {
        if (command.inside) {
            return this._tokenize({str, commands: command.inside, mode});
        } else if (command.mode) {
            return this._tokenizeMode(command, str);
        }
    }

    _tokenizeMode(command, str) {
        if (this._totalCommands[command.mode]) {
            let modeCommands = this._totalCommands[command.mode];
            return this._tokenize({str, commands: modeCommands, mode: command.mode});
        } else {
            // неверно указан язык
        }
    }

    _tokenizeExplode(commands, pockets, mode) {
        let result = [];

        for (let command of commands) {
            let match = pockets[command.pocket];

            if (match) {
                let token = {type: command.type, match, mode};
                token.inside = this._tokenizeInside(command, match, mode);

                result.push(token);
            } else {
                // неверное имя кармана
            }
        }
        ;

        return result;
    }

    _checkVicinity(command, str, match, lastIndex) {
        if (this._checkBehind(str, lastIndex, command.behind)) {
            if (this._checkNehind(str, lastIndex, command.nehind)) {
                if (this._checkForward(str, lastIndex + match.length, command.forward)) {
                    if (this._checkNorward(str, lastIndex + match.length, command.norward)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    _checkBehind(str, lastIndex, regExp) {
        if (regExp) {
            let behindStr = str.slice(0, lastIndex);
            return (new RegExp('(?:' + regExp.source + ')$', regExp.flags)).test(behindStr);
        } else {
            return true;
        }
    }

    _checkNehind(str, lastIndex, regExp) {
        if (regExp) {
            return !this._checkBehind(str, lastIndex, regExp);
        } else {
            return true;
        }
    }

    _checkForward(str, lastIndex, regExp) {
        if (regExp) {
            let forwardStr = str.slice(lastIndex);
            return (new RegExp('^(?:' + regExp.source + ')', regExp.flags)).test(forwardStr);
        } else {
            return true;
        }
    }

    _checkNorward(str, lastIndex, regExp) {
        if (regExp) {
            return !this._checkForward(str, lastIndex, regExp);
        } else {
            return true;
        }
    }

    _getCommands() {
        let commands = {};
        let inject = {};

        inject.html = [
            {
                type: 'html-tag',
                match: /<[^\/][^>\s]*?>/,
            },
            {
                type: 'html-tag',
                match: /<[^\/][^>\s]*/,
            },
            {
                type: 'html-tag',
                match: /<\/[^>\s]*?>/,
            },

            {
                type: 'html-attribute',
                match: /\b[^\s]+?=/,
            },
        ];

        inject.sql = [
            {
                type: 'sql-keyword',
                match: /\b(?:TIME_TO_SEC|SEC_TO_TIME|LEAST|MOD|ABS|ROUND|CEILING|FLOOR|LCASE|LOWER|UCASE|UPPER|SPACE|SUBSTRING|LENGTH|SEPARATOR|INTERVAL|TO_DAYS|DATE_FORMAT|MINUTE_SECOND|HOUR_MINUTE|DAY_HOUR|YEAR_MONTH|HOUR_SECOND|DAY_MINUTE|DAY_SECOND|EXTRACT|DAYOFYEAR|DAYNAME|YEARNAME|YEARWEEK|DAYOFWEEK|WEEKDAY|WEEK|YEAR|MONTH|DAY|DAYOFMONTH|HOUR|MINUTE|SECOND|LTRIM|RTRIM|TRIM|ELT|INSTR|LOCATE|POSITION|REPEAT|REVERSE|SUBSTRING_INDEX|REPLACE|LPAD|RPAD|CONCAT_WS|GROUP_CONCAT|CONCAT|SQRT|SIGN|ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|ASC|AS|as|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FIELD|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR|SUM|AVG|MIN|MAX|COUNT|SIGN|MID|DATE|NOW)\b/,

            },
        ];

        commands.html = [
            {
                type: 'php',
                match: /(%\?=|%\?)([\s\S]*?)(\?%)/,
                explode: [
                    {
                        type: 'php-open',
                        pocket: 1,
                    },
                    {
                        type: 'php',
                        pocket: 2,
                        mode: 'php',
                    },
                    {
                        type: 'php-close',
                        pocket: 3,
                    },
                ],
            },
            {
                type: 'php',
                match: /(%\?)([\s\S]*)/,
                explode: [
                    {
                        type: 'php-open',
                        pocket: 1,
                    },
                    {
                        type: 'php',
                        pocket: 2,
                        mode: 'php',
                    },
                ],
            },

            {
                type: 'comment',
                match: /<!--[\s\S]*?-->/,
            },

            {
                type: 'css',
                match: /(<style.*?>)([\s\S]*?)(<\/style>)/,
                explode: [
                    {
                        type: 'style',
                        pocket: 1,
                    },
                    {
                        type: '~',
                        pocket: 2,
                        mode: 'css',
                    },
                    {
                        type: 'style',
                        pocket: 3,
                    },
                ],
            },

            {
                type: 'javascript',
                match: /(<script.*?>)([\s\S]*?)(<\/script>)/,
                explode: [
                    {
                        type: 'script',
                        pocket: 1,
                    },
                    {
                        type: '~',
                        pocket: 2,
                        mode: 'javascript',
                    },
                    {
                        type: 'script',
                        pocket: 3,
                    },
                ],
            },
            {
                type: 'tag',
                match: /<[^\/][^>\s]*?>/,
            },
            {
                type: 'tag',
                match: /<\/[^>\s]*?>/,
            },
            {
                type: 'tag',
                match: /(<[^\/][^>]*?)(\s+)([^>]*?)(\s*)(>)/,
                explode: [
                    {
                        type: '~',
                        pocket: 1,
                    },
                    {
                        type: 'gap',
                        pocket: 2,
                    },
                    {
                        type: 'attributes',
                        pocket: 3,
                        inside: [
                            {
                                type: 'attribute',
                                nehind: /</,
                                match: /(on[^\s]+?)(\s*)(=)(\s*)("|')([\s\S]*?)(\5)/,
                                explode: [
                                    {
                                        type: 'name',
                                        pocket: 1,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 2,
                                    },
                                    {
                                        type: 'equal',
                                        pocket: 3,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 4,
                                    },
                                    {
                                        type: 'quote',
                                        pocket: 5,
                                    },
                                    {
                                        type: 'javascript',
                                        pocket: 6,
                                        mode: 'javascript',
                                    },
                                    {
                                        type: 'quote',
                                        pocket: 7,
                                    },
                                ],
                            },
                            {
                                type: 'attribute',
                                nehind: /</,
                                match: /([^\s]+?)(\s*)(=)(\s*)("|')([\s\S]*?)(\5)/,
                                explode: [
                                    {
                                        type: 'name',
                                        pocket: 1,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 2,
                                    },
                                    {
                                        type: 'equal',
                                        pocket: 3,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 4,
                                    },
                                    {
                                        type: 'quote',
                                        pocket: 5,
                                    },
                                    {
                                        type: 'value',
                                        pocket: 6,
                                        inside: [
                                            {
                                                type: 'php',
                                                match: /(%\?|%\?=)([\s\S]*?)(\?%)/,
                                                explode: [
                                                    {
                                                        type: 'php-open',
                                                        pocket: 1,
                                                    },
                                                    {
                                                        type: 'php',
                                                        pocket: 2,
                                                        mode: 'php',
                                                    },
                                                    {
                                                        type: 'php-close',
                                                        pocket: 3,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: 'quote',
                                        pocket: 7,
                                    },
                                ],
                            },
                            {
                                type: 'php',
                                match: /(%\?|%\?=)([\s\S]*?)(\?%)/,
                                explode: [
                                    {
                                        type: 'php-open',
                                        pocket: 1,
                                    },
                                    {
                                        type: 'php',
                                        pocket: 2,
                                        mode: 'php',
                                    },
                                    {
                                        type: 'php-close',
                                        pocket: 3,
                                    },
                                ],
                            },

                            {
                                type: 'property',
                                nehind: /</,
                                match: /\b[^\s<>"']+?\b/,
                            },
                        ],
                    },
                    {
                        type: 'gap',
                        pocket: 4,
                    },
                    {
                        type: '~',
                        pocket: 5,
                    },
                ],
            },
        ];

        commands.css = [
            {
                type: 'comment',
                match: /\/\*[\s\S]*?\*\//,
            },
            {
                type: 'block',
                match: /(\{)([\s\S]*?)(\})/,
                explode: [
                    {
                        type: 'bracket',
                        pocket: 1,
                    },
                    {
                        type: '~',
                        pocket: 2,
                        inside: [
                            {
                                type: 'comment',
                                match: /\/\*[\s\S]*?\*\//,
                            },
                            {
                                type: 'property',
                                match: /([a-zA-Z-]+?)(\s*)(:)(\s*)([\s\S]+?)(;)/,
                                explode: [
                                    {
                                        type: 'name',
                                        pocket: 1,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 2,
                                    },
                                    {
                                        type: 'punctuation',
                                        pocket: 3,
                                    },
                                    {
                                        type: 'gap',
                                        pocket: 4,
                                    },
                                    {
                                        type: 'value',
                                        pocket: 5,
                                        inside: [
                                            {
                                                type: 'string',
                                                match: /('|").*?\1/,
                                            }
                                        ],
                                    },
                                    {
                                        type: 'punctuation',
                                        pocket: 6,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'bracket',
                        pocket: 3,
                    },
                ],
            },
            {
                type: 'selector',
                match: /[^{}\/]+/,
                inside: [
                    {
                        type: 'punctuation',
                        match: /[,+>~]/,
                    },
                    {
                        type: 'bracket',
                        match: /[()]/,
                    },
                    {
                        type: 'attribute',
                        match: /(\[)([a-z-]+)(\])/,
                        explode: [
                            {
                                type: 'bracket',
                                pocket: 1,
                            },
                            {
                                type: 'name',
                                pocket: 2,
                            },
                            {
                                type: 'bracket',
                                pocket: 3,
                            },
                        ],
                    },
                    {
                        type: 'attribute',
                        match: /(\[)([a-z-]+)(\s*)([|$*~|^]?=)(\s*)(["'])([a-z-]+)(\6)(\])/,
                        explode: [
                            {
                                type: 'bracket',
                                pocket: 1,
                            },
                            {
                                type: 'name',
                                pocket: 2,
                            },
                            {
                                type: 'gap',
                                pocket: 3,
                            },
                            {
                                type: 'operator',
                                pocket: 4,
                            },
                            {
                                type: 'gap',
                                pocket: 5,
                            },
                            {
                                type: 'quote',
                                pocket: 6,
                            },
                            {
                                type: 'value',
                                pocket: 7,
                            },
                            {
                                type: 'quote',
                                pocket: 8,
                            },
                            {
                                type: 'bracket',
                                pocket: 9,
                            },
                        ],
                    },
                    {
                        type: 'function',
                        match: /::?[a-z-]+/,
                        forward: /\(/,
                    },
                    {
                        type: 'pseudo',
                        match: /::?[a-z-]+/,
                        norward: /\(/,
                    },
                    {
                        type: 'id',
                        match: /#[a-z0-9_-]+/i,
                    },
                    {
                        type: 'class',
                        match: /\.[a-z0-9_-]+/i,
                    },
                ]
            },

        ];

        commands.javascript = [
            {
                type: 'marked',
                match: /\/\/!!.*/,
            },
            {
                type: 'comment',
                match: /\/\*[\s\S]*?\*\//,
            },
            {
                type: 'comment',
                match: /\/\/.*/,
            },
            {
                type: 'string',
                match: /('|").*?[^\\]\1/,
                inside: [
                    ...inject.html,
                ],
            },

            // Косые кавычки
            {
                type: 'string',
                match: /(`)([\s\S]*?[^\\])(`)/,

                explode: [
                    {
                        type: '~',
                        pocket: 1,
                    },
                    {
                        type: '~',
                        pocket: 2,
                        inside: [
                            {
                                type: 'insert',
                                match: /(\$\{)([\s\S]*?)(\})/,
                                explode: [
                                    {
                                        type: '~',
                                        pocket: 1,
                                    },
                                    {
                                        type: 'javascript',
                                        pocket: 2,
                                        mode: 'self',
                                    },
                                    {
                                        type: '~',
                                        pocket: 3,
                                    },
                                ],
                            },
                            ...inject.html,
                        ],

                    },
                    {
                        type: '~',
                        pocket: 3,
                    },
                ]

            },
            //-
            {
                type: 'keyword',
                match: /\b(if|else|switch|case|default|while|for|break|continue|return|in|of|class|instanceof|function|try|throw|catch|finally)\b/,
            },
            {
                type: 'definition',
                match: /\b(var|let|const|new)\b/,
            },
            {
                type: 'instance',
                match: /\b(this|window|document|Date|String|Number|Boolean|RegExp)\b/,
            },
            {
                type: 'value',
                match: /\b(true|false|null|undefined|Infinity|NaN)\b/,
            },
            {
                type: 'punctuation',
                match: /[,.:;]/,
            },
            {
                type: 'operator',
                match: /=|--?|\+\+?|\*|\/|!=?=?|<=?|>=?|===?|&&?|\|\|?|\?|~|\^|%/,
            },
            {
                type: 'bracket',
                match: /[\(\)\[\]\{\}]/,
            },
            {
                type: 'number',
                match: /\d+(\.\d+)?/,
            },
            {
                type: 'variable',
                nehind: /\./,
                match: /[_$a-zA-Z0-9]+/,
                norward: /[(.:]/,
            },
            {
                type: 'key',
                match: /[_$a-zA-Z0-9]+/,
                forward: / *:/,
            },
            {
                type: 'property',
                behind: /\./,
                match: /[_$a-zA-Z0-9]+/,
                norward: /\(/,
            },
            {
                type: 'object',
                match: /[_$a-zA-Z][_$a-zA-Z0-9]*/,
                forward: /\./,
            },
            {
                type: 'method',
                behind: /\./,
                match: /[_$a-zA-Z][_$a-zA-Z0-9]*/,
                forward: /\(/,
            },
            {
                type: 'function',
                nehind: /\./,
                match: /[_$a-zA-Z][_$a-zA-Z0-9]*/,
                forward: /\(/,
            },

        ];

        commands.php = [
            {
                type: 'php-open',
                match: /%\?=|%\?/,
            },
            {
                type: 'php-close',
                match: /\?%/,
            },

            {
                type: 'marked',
                match: /\/\/!!.*/,
            },
            {
                type: 'comment',
                match: /\/\*[\s\S]*?\*\//,
            },
            {
                type: 'comment',
                match: /\/\/.*/,
            },

            {
                type: 'key',
                match: /'[_$a-zA-Z0-9]+'/,
                forward: / => /,
            },
            {
                type: 'key',
                match: /"[_$a-zA-Z0-9]+"/,
                forward: / => /,
            },
            {
                type: 'key',
                match: /[0-9]+/,
                forward: / => /,
            },

            // Строки
            {
                type: 'string',
                match: /''|""/,
            },
            {
                type: 'string',
                match: /'[\s\S]*?[^\\]'/,

                inside: [
                    ...inject.html,
                    ...inject.sql,
                ],
            },
            {
                type: 'string',
                match: /"[\s\S]*?[^\\]"/,

                inside: [
                    {
                        type: 'variable',
                        match: /\$[_a-zA-Z0-9]+/,
                    },

                    ...inject.html,
                    ...inject.sql,
                ],
            },
            //-

            {
                type: 'keyword',
                match: /\b(require_once|require|include_once|include|new|and|or|xor|array|echo|if|else|elseif|endif|switch|case|while|endwhile|for|endfor|foreach|endforeach|as|break|continue|return|class|interface|trait|namespace|use|extends|implements|instanceof|insteadof|function|try|throw|catch|finally)\b/,
            },
            {
                type: 'instance',
                match: /\b(\$this|parent|self)/,
            },
            {
                type: 'special',
                match: /\$_GET|\$_POST|\$_REQUEST|\$_SERVER|\$_SESSION|\$_COOKIE|\$GLOBALS/,
            },
            {
                type: 'definition',
                match: /\b(public|protected|private|static|const)\b/,
            },
            {
                type: 'abstract',
                match: /\b(abstract)\b/,
            },
            {
                type: 'value',
                match: /\b(true|false|null)\b/,
            },
            {
                type: 'punctuation',
                match: /[,.:;]/,
            },
            {
                type: 'operator',
                match: /=>|->|=|--?|\+\+?|\*|\/|!=?=?|<=?|>=?|===?|&&?|\|\|?|\?|~|\^|%/,
            },
            {
                type: 'bracket',
                match: /[\(\)\[\]\{\}]/,
            },
            {
                type: 'variable',
                match: /\$[_a-zA-Z0-9]+/,
                norward: /->/,
            },
            {
                type: 'object',
                match: /\$[_a-zA-Z][_a-zA-Z0-9]*/,
                forward: /->/,
            },
            {
                type: 'property',
                behind: /->/,
                match: /[_a-zA-Z0-9-]+/,
                norward: /\(/,
            },
            {
                type: 'method',
                behind: /->/,
                match: /[_a-zA-Z-][_a-zA-Z0-9-]*/,
                forward: /\(/,
            },
            {
                type: 'function',
                nehind: /->/,
                match: /[_a-zA-Z-][_a-zA-Z0-9-]*/,
                forward: /\(/,
            },
            {
                type: 'number',
                match: /\d+(\.\d+)?/,
            },
        ];

        return commands;
    }

}

window.addEventListener('DOMContentLoaded', function () {
    // Подсветка кода
    (function () {
        let highlighter = new Highlighter();
        let elems = document.querySelectorAll('code[data-m="+highlight"]');

        for (let elem of elems) {
            elem.innerHTML = highlighter.handle(elem.innerHTML, elem.dataset.lang);
        }
    }());
});