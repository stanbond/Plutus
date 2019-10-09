// components/Nav.js
import React from 'react';
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
import { Link, withRouter } from 'react-router-dom';
import SearchForm from './SearchForm';
import './Nav.css';

const { IS_LOGGED_IN } = Queries;

const Nav = props => {
    return (
        <ApolloConsumer>
            {client => (
                <Query query={IS_LOGGED_IN}>
                    {({ data }) => {
                        if (data.isLoggedIn) {
                            return (
                                <div className="loggedin-navbar">
                                    <img src="Logo5.png" alt="plutus-logo" className="plutus-logo-nav" />
                                    <SearchForm />
                                    <ul className="profile-dropdown-main" id="profile-dropdown-main">
                                        <li><img src="" className="" alt="" /></li>
                                        <ul className="profile-dropdown-menu" id="profile-dropdown-menu">
                                            <li className="profile-dropdown-header">
                                                <img src="" className="" alt="" />
                                            </li>
                                            <li><Link to={`/users/:id`}>Profile</Link></li>
                                        <li><Link to="/messages">Messages</Link></li>
                                        </ul>
                                    </ul>
                                    <div className="nav-logout-div">
                                        <div className="box">
                                            <div className="btn logout-btn">
                                                <span
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        localStorage.removeItem("auth-token");
                                                        localStorage.removeItem("currentUser");
                                                        client.writeData({ data: { isLoggedIn: false, currentUser: null } });
                                                        props.history.push("/");
                                                    }}
                                                >Logout</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nav-shadow"></div>
                                </div>
                            ) 
                        } else {
                            return (
                                <div className="loggedout-navbar">
                                    <img src="Logo5.png" alt="plutus-logo-nav" className="plutus-logo-nav" />
                                    <SearchForm />
                                    <div className="nav-button-duo">
                                        <Link to="/login" className="nav-button">Login</Link>
                                        <Link to="/register" className="nav-button">Sign Up</Link>
                                    </div>
                                    <div className="nav-shadow"></div>
                                </div>
                            );
                        }
                    }}
                </Query>
            )}
        </ApolloConsumer>
    );
};

export default withRouter(Nav);