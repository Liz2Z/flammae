import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import marked from './marked';
import './markdown.less';
import './code-highlight.css';

/**
 * 用于渲染markdown文件内容的组件
 *
 * 1. 将markdown文件文本通过marked编译后作为html直接渲染
 * 2. 通过ReactDOM.render渲染demo
 * 3.
 */
class Markdown extends Component {
    // state = {
    // opacity: 1,
    // }

    componentDidMount() {
        this.renderDemo();
    }
    componentDidUpdate(prevProps) {
        if (this.props.md !== prevProps.md) {
            this.renderDemo();
        }
    }
    componentWillUnmount() {
        this.props.md.demos.forEach(({ container }) => {
            if (!container) {
                return;
            }
            ReactDOM.unmountComponentAtNode(document.getElementById(container));
        });
    }

    /**
     * 渲染demo
     */
    renderDemo() {
        const { DemoComponent: Demo, md } = this.props;
        md.demos.forEach(
            ({ style, exec, codeSource, note, lang, container }) => {
                /**
                 * markdown style
                 */
                if (style) {
                    exec();
                    return;
                }

                if (!container) {
                    return;
                }

                const codeHtml = codeSource && marked(codeSource);
                const noteHtml = note && marked(note);

                ReactDOM.render(
                    <Demo
                        codeHtml={codeHtml}
                        noteHtml={noteHtml}
                        exec={exec()}
                        lang={lang}
                    />,
                    document.getElementById(container)
                );
            }
        );
    }

    /**
     * 根据markdown文本生成html，待更新后渲染demo
     * @param {string} str
     */
    renderMarkdown = memoizeOne(marked);

    render() {
        return (
            <div
                className="markdown"
                dangerouslySetInnerHTML={{
                    __html: this.renderMarkdown(this.props.md.text),
                }}
            />
        );
    }
}

Markdown.propTypes = {
    md: PropTypes.shape({
        text: PropTypes.string,
        demos: PropTypes.array,
    }).isRequired,
};

export default Markdown;
