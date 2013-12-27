import React, { Component } from 'react';
import { withFirebase } from './components/Firebase';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Login from './components/login/login';
import Loading from './components/loading/loading';
import Header from './components/header/header';
import MainMenu from './components/mainmenu/mainmenu';
import Dashboard from './components/dashboard/';
import Settings from './components/settings/settings';
import About from './components/about/about';
import './App.css';

const PrivateRoute = ({component: Component, user, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => user
        ? <Component {...props} {...rest} user={user} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        // : <Redirect to='/login' />}
    />
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      from: null,
      drawer: false
    }
  }

  componentDidMount = () => {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user, loading: false })
        this.props.firebase.initializeUser(user.uid);
      } else {
        this.setState({ user: null, loading: false });
      }
    })
    document.body.style.backgroundImage = `url(https://picsum.photos/g/1920/1080?image=773)`
  }

  // writeTestData = () => {
  //   this.props.firebase.goalsRef.add({name: "banana Johnson"})
  // }

  signIn = async () => {
    const result = await this.props.firebase.signIn();
    this.setState({ user: result.user });
  }

  signOut = () => {
    this.props.firebase.logout();
    this.toggleDrawer();
  }

  toggleDrawer = () => {
    this.setState({
      drawer: !this.state.drawer
    })
  }

  render() {
    return (
      <Router basename="/goaler">
        <Loading status={this.state.loading}>
          <div className="App">
          <Header user={this.state.user} login={this.signIn} toggleDrawer={this.toggleDrawer}/>
          <Drawer anchor={"right"} open={this.state.drawer} onClose={this.toggleDrawer}>
            <MainMenu logout={this.signOut} toggleDrawer={this.toggleDrawer}/>
          </Drawer>
          <Route path="/login" render={(props)=> <Login {...props} user={this.state.user} login={this.signIn} />} />
          <PrivateRoute user={this.state.user} exact path='/about' component={About}/>
          <PrivateRoute user={this.state.user} exact path='/' component={Dashboard}/>
          <PrivateRoute user={this.state.user} exact path='/settings' component={Settings}/>
          {/* <Link to="/private">Banana</Link>
          <Link to="/private/2">Banana2</Link>
          <PrivateRoute user={this.state.user} exact path='/private' component={Banana} text="React Router"/>
          <PrivateRoute user={this.state.user} path='/private/:num' component={Banana} text="React Router" /> */}
          </div>
        </Loading>
      </Router>
    );
  }
}

export default withFirebase(App);
