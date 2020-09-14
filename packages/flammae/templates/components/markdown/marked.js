/* eslint-disable */

import marked from 'marked';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

// marked https://marked.js.org
marked.setOptions({
    highlight: code => hljs.highlightAuto(code).value,
    gfm: true, // 启用github标准
});

const renderer = new marked.Renderer();

// 重写heading输出规则
// renderer.heading = function (text, level) {
//     var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//     return `
//           <h${level}>
//             <a name="${escapedText}" class="anchor" href="#${escapedText}">
//               <span class="header-link">${text}</span>
//             </a>
//           </h${level}>`;
// };

export default function(str) {
    return marked(str, {
        renderer,
    });
}
