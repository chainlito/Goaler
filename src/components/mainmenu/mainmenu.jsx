import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import GoalsIcon from '@material-ui/icons/DoneAll'
import InfoIcon from '@material-ui/icons/Info'
import HomeIcon from '@material-ui/icons/Home'
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from 'react-router-dom';
import './mainmenu.css'

class MainMenu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    navigate = route => {
        this.props.history.push(route);
        this.props.toggleDrawer();
    }

    render() {
        return (
            <List className="mainmenu">
                <ListItem button onClick={() => this.navigate('/login')}>
                    <ListItemIcon>
                        <HomeIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => this.navigate('/')}>
                    <ListItemIcon>
                        <GoalsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Goals" />
                </ListItem>
                <ListItem button onClick={() => this.navigate('/about')}>
                    <ListItemIcon>
                        <InfoIcon/>
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem button onClick={() => this.navigate('/settings')}>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <Divider/>
                <ListItem button onClick={this.props.logout}>
                    <ListItemIcon>
                        <ExitIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </List>
        )
    }
}

export default withRouter(MainMenu);