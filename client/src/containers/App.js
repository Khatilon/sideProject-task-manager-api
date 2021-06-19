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

  // search github user
  searchUsers = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=
    ${process.env.GITHUB_CLIENT_ID}&client_secret=
    ${process.env.GITHUB_CLIENT_SECRET}`);

    if (res) {
      // console.log(res);
      this.setState({
        loading: false,
        users: res.data.items
      });
    }
    const res2 = await axios.get(`/testroute/${text}`);

    console.log('res2', res2);
    this.setState({checkAPI: res2.data});
  }

  // Get single Github user

  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=
    ${process.env.GITHUB_CLIENT_ID}&client_secret=
    ${process.env.GITHUB_CLIENT_SECRET}`);

    if (res) {
      // console.log(res);
      this.setState({
        loading: false,
        user: res.data
      });
    }
  };

  // Get user repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=
    ${process.env.GITHUB_CLIENT_ID}&client_secret=
    ${process.env.GITHUB_CLIENT_SECRET}`);

    if (res) {
      // console.log(res);
      this.setState({
        loading: false,
        repos: res.data
      });
    }
  };
  // clear user 
  clearUsers = () => this.setState({ users: [], loading: false });

  // set alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => {
      this.setState({alert: null});
    }, 2000);
  }

  async componentDidMount() {

    this.setState({
      loading: true
    });

    const res = await axios.get(`https://api.github.com/users?client_id=
    ${process.env.GITHUB_CLIENT_ID}&client_secret=
    ${process.env.GITHUB_CLIENT_SECRET}`);

    if (res) {
      this.setState({
        loading: false,
        users: res.data
      });
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
                    {checkAPI && checkAPI.name}
                    <Alert alert={alert}/>
                    <Switch>
                      <Route exact path='/' render={(props) => (
                        <Fragment>
                          
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