import React, { Component } from 'react';

class Content extends Component {
    render() {
        return <div>{this.props.renderMarkdown()}</div>;
    }
}

export default Content;
