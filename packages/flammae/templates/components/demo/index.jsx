import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class CodeDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldExpand: false,
        };
        this.demoEl = React.createRef();
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            shouldExpand: !this.state.shouldExpand,
        });
    }

    componentDidMount() {
        this.props.exec.mount(this.demoEl.current);
    }

    componentWillUnmount() {
        this.props.exec.unMount(this.demoEl.current);
    }

    render() {
        const { shouldExpand } = this.state;
        const { noteHtml, codeHtml } = this.props;

        return (
            <React.Fragment>
                <div className="code-running-demo" ref={this.demoEl} />
                {codeHtml && (
                    <div
                        className={`code-text-demo-wrapper${
                            shouldExpand ? ' _active' : ''
                        }`}
                    >
                        {shouldExpand && (
                            <React.Fragment>
                                {noteHtml && (
                                    <div
                                        className="code-text-demo-note"
                                        dangerouslySetInnerHTML={{
                                            __html: noteHtml,
                                        }}
                                    ></div>
                                )}
                                <div
                                    className="code-text-demo"
                                    dangerouslySetInnerHTML={{
                                        __html: codeHtml,
                                    }}
                                ></div>
                            </React.Fragment>
                        )}
                        <div className="toggle-btn-wrapper">
                            <span className="toggle-btn" onClick={this.toggle}>
                                {shouldExpand ? '隐藏代码' : '显示代码'}
                            </span>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

CodeDemo.propTypes = {
    noteHtml: PropTypes.string,
    codeHtml: PropTypes.string,
    lang: PropTypes.string,
    render: PropTypes.func,
};

export default CodeDemo;
