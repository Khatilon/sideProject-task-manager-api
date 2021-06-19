import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, HashRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Users from '../components/users/Users';
import User from '../components/users/User';
import Search from '../components/users/Search';
import Alert from '../components/layout/Alert';
import About from '../components/pages/About';
import axios from 'axios';
import './App.css'

class App extends Component {

  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
    checkAPI: null
  }
  // https://docs.github.com/en/rest/overview/endpoints-available-for-github-apps

  personProfileCall = async () => {
    const res = await axios.get('/users/me');
    console.log(res);
  };

  logoutCall = async () => {
    const res = await axios.post('/users/logout');
    console.log(res);
  }

  async componentDidMount() {

    this.setState({
      loading: true
    });

    const res = await axios.post('/users/login', {
      email: 'mike@example.com',
      password: 'Red123!'
    });

    if (res) {
      console.log(res)
    }
  }
  
  render() {
      const { users, loading, alert, user, repos, checkAPI } = this.state;

      return (
          <>
            {/* router章節在ep.21 */}
            <HashRouter>
              {/* 
                由於create-app本身會處理掉BrowserRouter的問題(我們透過後端也可以), 記得部署前要改回BrowserRouter
                但改成用link來切換route後就解決本身問題了, 因為link本身具有history作用, 詳細參考文章...

                在react router如果要連到其他頁面我們不使用<a href="/">，使用<Link to="/">來替代 
                這樣切換時可以順利render出畫面(在網址上直接改會錯, 但包起來並用後端起後在網址上直接改會對, 若是用link來實作則都會是對的)

                但在user.js頁面時 重新整理好像會有問題 先維持HashRouter部署！
              */}
              <div className="app">
                <Navbar />
                <div className="container">
                    <Alert alert={alert}/>
                    <Switch>
                      <Route exact path='/' render={(props) => (
                        <Fragment>
                          <button onClick={this.personProfileCall}>Read profile</button>
                          <button onClick={this.logoutCall}>Loug out</button>
                        </Fragment>
                      )} />
                    </Switch>
                    <Route path='/about' component={About} />
                </div>
              </div>
            </HashRouter>
          </>
      )
  }
}

export default App;