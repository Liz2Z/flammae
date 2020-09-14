import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';
<%
$data.stylePaths.map(path => `import '${path}';`)
%>
import { routes } from 'flammae';


function Router() {
    return (
        <HashRouter>
            <Switch>
                {routes.map(route => (
                    <Route
                        exact
                        path={route.path}
                        component={route.component}
                        key={route.path}
                    />
                ))}
                <Redirect from="*" to="/index" />
            </Switch>
        </HashRouter>
    );
}


ReactDOM.render(<Router/>, document.querySelector('#root'));
