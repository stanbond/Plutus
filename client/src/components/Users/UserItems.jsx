import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from '../../graphql/queries';
import { Image } from 'cloudinary-react';
import { translate } from 'react-switch-lang';
import { withRouter } from 'react-router-dom';
const { FETCH_ITEMS } = queries;


class UserItems extends Component {
    constructor(props) {
        super(props)
    
        this.openItem = this.openItem.bind(this);
    }

    openItem(itemId){
        return (e) => {
            this.props.history.push(`/items/${itemId}`);
        }
    }
    

    render() {
        const { t } = this.props;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const items = data.items.filter(item => item.seller.id === this.props.user.id);
                    const itemsLi = items.map(item => {
                        return (
                            <li key={item.id} className="card border-primary mb-3" onClick={this.openItem(item.id)}>
                                <div className="card-body">
                                    <Image cloudName='chinweenie' publicId={item.champions[0]} />
                                    <h4 className="card-title">
                                        {item.name}
                                    </h4>
                                    <p className="card-text">{t("p.sellingAt")} {item.starting_price}</p>
                                </div>
                            </li>
                        )
                    })
                    return (
                        <div>
                            <link rel="stylesheet" href="https://bootswatch.com/4/minty/bootstrap.min.css" />
                            <ul className="items-list">
                                {itemsLi}
                            </ul>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default withRouter(translate(UserItems));