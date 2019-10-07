// components/Nav.js
import React from 'react';
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
import { Link, withRouter } from 'react-router-dom';
import SearchForm from './SearchForm';

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
                                    <img src="Logo5.png" alt="plutus-logo" className="plutus-logo-nav"/>
                                    <SearchForm />

                                    <div className="nav-logout-div">
                                        <button
                                            className="nav-logout-button"
                                            onClick={e => {
                                                e.preventDefault();
                                                localStorage.removeItem("auth-token");
                                                client.writeData({ data: { isLoggedIn: false } });
                                                props.history.push("/");
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className="loggedout-navbar">
                                    <img src="Logo5.png" alt="plutus-logo-nav" className="plutus-logo-nav" />
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