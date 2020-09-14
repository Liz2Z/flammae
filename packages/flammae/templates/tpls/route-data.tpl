<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    return `import Component${i} from '${item.filePath}';`;
})
%>
<%
$data.siteData.docs.length 
? `import getMarkdownRender from './markdown-render';`
: null
%>

<%
$data.siteData.pages.length 
? `import { isValidElementType } from 'react-is';`
: null
%>


export default [
<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    const __DOC__ = item.type === 'doc';
    const moduleName = `Component${i}`;
    return `{
        component: ${__DOC__ ? `getMarkdownRender(${moduleName})`: `isValidElementType(${moduleName}) ? ${moduleName} : null `},
        path: '${item.routePath}',
        type: '${item.type}',
        title: '${item.title}',
},`;
})
%>
];
