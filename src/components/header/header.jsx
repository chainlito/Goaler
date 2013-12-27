import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LogoIcon from '@material-ui/icons/Beenhere';
import MenuIcon from '@material-ui/icons/Menu';
import { withTheme } from '@material-ui/core/styles';
import './header.css';

class Header extends Component {
    render() {
        return (
            <header>
                <AppBar position="static" className="header" 
                    style={{backgroundColor: this.props.theme.palette.primary.main + '80' }}>
                    <Toolbar className="row">
                        <Link to="/">
                            <Button color="inherit" aria-label="Logo">
                                <LogoIcon />
                                <Typography variant="h6" color="inherit">
                                    Goaler
                                </Typography>
                            </Button>
                        </Link>
                        <div>
                        {
                            this.props.user
                            ? <IconButton color="inherit" onClick={this.props.toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                            : <Button color="inherit" onClick={this.props.login}>Sign In</Button>
                        }
                        </div>
                    </Toolbar>
                </AppBar>
            </header>
        )
    }
}

export default withTheme()(Header);