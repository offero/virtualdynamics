import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Auth from '../lib/auth';

const styles = () => ({
  login: {
    marginLeft: 'auto',
  },
});

class NavBar extends React.Component {
  static login() {
    console.log('NavBar.login');
    Auth.savePath(Router.asPath);
    Router.push('/login');
  }

  state = {
    loggedIn: false,
  };

  componentDidMount() {
    const loggedIn = Auth.isAuthenticated();
    this.setState({
      loggedIn,
    });
  }

  render() {
    const { classes } = this.props;
    const { loggedIn } = this.state;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              offero.tech
            </Typography>
            {loggedIn ? (
              <Link href="/logout">
                <Button className={classes.login} color="inherit">
                  Logout
                </Button>
              </Link>
            ) : (
              <Button className={classes.login} onClick={NavBar.login} color="inherit">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavBar);
