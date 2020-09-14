import React from 'react';
<%
`import Content from '${$data.content}';`
%>
<%
`import Markdown from '${$data.markdown}';`
%>
<%
`import Demo from '${$data.demo}';`
%>


export default function getMarkdownRender(markdownData) {
    return props => (
        <Content
            {...props}
            renderMarkdown={() => (
                <Markdown demoComponent={Demo} md={markdownData} />
            )}
            data={markdownData}
        />
    );
}
