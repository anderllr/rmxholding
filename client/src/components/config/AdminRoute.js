import React from 'react';
import { isAuthenticated } from '../utils/auth';

import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
        }
    />
);

export default AdminRoute;