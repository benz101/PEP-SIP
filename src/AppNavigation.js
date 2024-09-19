import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppNavigationWithState } from './configureStore';

class AppNavigation extends Component {

    render() {
        
        return (
            <AppNavigationWithState/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        nav: state.nav,
    }
}

export default connect(mapStateToProps)(AppNavigation)