'use strict';

/**
 * 当我们在.md中编写一份代码，我们希望在渲染markdown时，同时能展示源代码及源代码执行后的结果，
 * 因此规定了**冒号区域（colon-zone）**的写法，冒号区域格式如下：
 * ::: cmd1 cmd2
 * note
 * ``` jsx
 * code
 * ```
 * :::
 *
 * 当采用冒号区域写法时，其内部的代码片段将支持渲染源码及被执行后展示
 *
 */

const jsxPlugin = require('@flammae/markdown-plugin-jsx');
const { space, newLine } = require('./symbols');

/**
 * 生成用于匹配如下内容格式的正则字符串
 *
 * :::
 * here is some content in colon-zone
 * :::
 * 或
 * ``` jsx
 * 'code here'
 * ```
 * @param {'```' | ':::'} sym
 */
function getBlockRegStr(sym) {
    return `${sym}(${space}*)(.*)?(${newLine})((?:(?!(${sym})).)*(${newLine}))*${sym}`;
}

// 匹配所有冒号区域（colon-zone）的正则
const colonZoneSym = ':::';
const colonZoneRegStr = getBlockRegStr(colonZoneSym);
const colonZoneGlobalReg = new RegExp(colonZoneRegStr, 'g');

// 匹配代码块的正则
const codeBlockSym = '```';
const codeBlockRegStr = getBlockRegStr(codeBlockSym);
const codeBlockReg = new RegExp(codeBlockRegStr);

/**
 * 分离出特殊区域中的主体内容跟前缀指令
 * 例如：
 * ``` jsx
 * 'code here'
 * ```
 * === >>> ['jsx', 'code here']
 *
 * 或
 *
 * ::: only
 * 'note here'
 * :::
 * === >>> ['only', 'note here']
 *
 * @param {string} str
 * @param {string} sym
 */
function splitCmdAndContent(str, sym) {
    const subStr = str.replace(new RegExp(sym, 'g'), '');
    const arr = subStr.match(new RegExp(`(.*)(${newLine})((.|${newLine})*)`));
    return [arr[1].trim(), arr[3]];
}

/**
 * 返回一个用于处理冒号区域的函数。
 * 该函数处理冒号区域，返回：
 * 1. 指令；
 * 2. 备注信息；
 * 3. 代码块语言；
 * 4. 源代码文本；
 * 5. 一个用于执行源代码的函数
 */
function getColonZoneHandleFn({ pluginsMap, replaceSource }) {
    const defaultExec =
        'function() {\nreturn {\nmount: function(){},\nunMount: function(){},\n};\n}';
    /**
     * 生成字符串
     */
    const getReturnString = ({
        lang,
        commands = [],
        codeSource = '',
        note = '',
        exec = defaultExec,
        container,
    }) => `{
    lang: ${lang && `'${lang}'`},
    style: ${commands.includes('style')},
    only:  ${commands.includes('only')},
    codeSource: \`${codeSource.replace(/`/g, '\\`')}\`,
    note: \`${note.replace(/`/g, '\\`')}\`,
    exec : ${exec},
    container: ${container && `'${container}'`},
}`;

    /**
     * 处理冒号区域的函数
     */
    let index = 1;
    return colonZone => {
        /**
         * 从冒号区域中分离出 代码块
         * ``` jsx
         * 'code here'
         * ```
         * 因为codeBlocks是经过正则`codeBlockGlobalReg`匹配到的，
         * 所以肯定会有，不会错
         */
        const codeBlock = colonZone.match(codeBlockReg)[0];

        /**
         * 从冒号区域剔除代码块，保留纯净的冒号区域
         * ::: only
         * info text
         * :::
         */
        const colonZoneLite = colonZone.replace(codeBlock, '');

        // 分离特殊区域的主体内容跟前缀指令
        //    代码语言   代码内容
        const [lang, code] = splitCmdAndContent(codeBlock, codeBlockSym);
        //    指令     演示代码的附加信息
        const [commandStr, note] = splitCmdAndContent(
            colonZoneLite,
            colonZoneSym
        );
        // 移除前后空格
        const commands = commandStr.split(space);

        // 代码块是为了引入样式文件
        if (commandStr === 'style') {
            /**
             * 从源文件中删除这段冒号区域，并用 `'\n\n'` 替换
             * 因为在markdown中，上下两行中间没用换行符的话会被当成一行
             * 不用 `'\n\n'` 替换会影响源文件格式，只加一个 `'\n'`就够了
             */
            replaceSource(colonZone, '\n\n');
            return getReturnString({
                exec: `function() {${code}}`,
                commands,
            });
        }

        // 使用div替换掉源文件中冒号区域
        const id = `colon-zone-${index}`;
        index += 1;
        replaceSource(colonZone, `<div id='${id}'></div>\n\n`);

        // 未定义代码块语言类型
        if (!lang) {
            // return getReturnString({
            //     note,
            //     commands,
            //     codeSource: codeBlock,
            //     container: id,
            // });
            throw new Error(
                'Undefined language type. (@flammae/markdown-loader)'
            );
        }

        // 其它代码，用专用的插件进行编译
        const codeCompiler = pluginsMap[lang];

        if (!codeCompiler) {
            throw new Error(
                `You may need to specify a plugin to handle the ${lang} language. (@flammae/markdown-loader)`
            );
        }

        // 编译代码
        const compiledCode = codeCompiler(code, {
            commands,
        });

        return getReturnString({
            lang,
            note,
            commands,
            codeSource: codeBlock,
            exec: compiledCode,
            container: id,
        });
    };
}

/**
 * 集中处理所有.md源文件中的所有 冒号区域
 * 将其处理成可**演示代码**同时可**展示源代码**的函数
 */
function handleColonZones(source, { plugins = {}, replaceSource }) {
    // 插件。根据代码块中代码种类的不同选用不同的插件进行处理
    const pluginsMap = {
        jsx: jsxPlugin,
        ...plugins,
    };

    // 所有的冒号区域
    const colonZones = source.match(colonZoneGlobalReg);

    if (!colonZones) {
        return '[]';
    }

    const colonZoneHandleFn = getColonZoneHandleFn({
        pluginsMap,
        replaceSource,
    });

    const results = colonZones.map(colonZoneHandleFn);

    return `[\n${results.join(',')}\n]`;
}

module.exports = handleColonZones;
