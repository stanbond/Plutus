import React, { Component } from "react";
import { Mutation } from "react-apollo";

import { CREATE_ITEM } from "../../graphql/mutations";
import Queries from "../../graphql/queries";
const { FETCH_ITEMS } = Queries;

class CreateItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            name: "",
            seller: "",
            description: "",
            imageURLs: [],
            starting_price: 0,
            minimum_price: 0,
            // location: [],
            category: "",
            sold: false,
            appraised: false
        };
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }

    // we need to remember to update our cache directly with our new item
    updateCache(cache, { data }) {
        let items;
        try {
            // if we've already fetched the items then we can read the
            // query here
            items = cache.readQuery({ query: FETCH_ITEMS });
        } catch (err) {
            return;
        }
        // if we had previously fetched items we'll add our new item to our cache
        if (items) {
            let itemArray = items.items;
            let newItem = data.newItem;
            cache.writeQuery({
                query: FETCH_ITEMS,
                data: { items: itemArray.concat(newItem) }
            });
        }
    }
    updateImageURLs(){
        return e => console.log("upload image url")
    }
    updateLocation(){
        return e => console.log("current location")
    }
    handleSubmit(e, newItem) {
        e.preventDefault();
        newItem({
            variables: {
                name: this.state.name,
                seller: this.state.seller,
                description: this.state.description,
                imageURLs: this.state.imageURLs,
                starting_price: this.state.starting_price,
                minimum_price: this.state.minimum_price,
                // location: this.state.location,
                category: this.state.category,
                sold: this.state.sold,
                appraised: this.state.appraised
            }
        });
    }

    render() {
        return (
            <Mutation
                mutation={CREATE_ITEM}
                // if we error out we can set the message here
                onError={err => this.setState({ message: err.message })}
                // we need to make sure we update our cache once our new item is created
                update={(cache, data) => this.updateCache(cache, data)}
                // when our query is complete we'll display a success message
                onCompleted={data => {
                    const { name } = data.newItem;
                    this.setState({
                        message: `New item ${name} created successfully`
                    });
                }}
            >
                {(newItem, { data }) => (
                    <div>
                        <form onSubmit={e => this.handleSubmit(e, newItem)}>
                            <input
                                onChange={this.update("name")}
                                value={this.state.name}
                                placeholder="Name"
                            />
                            <input
                                onChange={this.update("seller")}
                                value={this.state.seller}
                                placeholder="Seller"
                            />
                            <textarea
                                onChange={this.update("description")}
                                value={this.state.description}
                                placeholder="description"
                            />
                            {/* <input
                                onChange={this.updateImageURLs()}
                                value={this.state.imageURLs}
                                placeholder="Upload image urls"
                            /> */}
                            <label>
                                Starting Price: 
                                <input
                                    onChange={this.update("starting_price")}
                                    value={this.state.starting_price}
                                    type="number"
                                />
                            </label>
                            <label>
                                Minimum Price:
                                <input
                                    onChange={this.update("minimum_price")}
                                    value={this.state.minimum_price}
                                    placeholder="Minimum Price"
                                    type="number"
                                />
                            </label>
                            {/* <input
                                onChange={this.updateLocation("location")}
                                value={this.state.location}
                                placeholder="Location"
                            /> */}
                            <input
                                onChange={this.update("category")}
                                value={this.state.category}
                                placeholder="Category"
                            />
                            <input
                                onChange={this.update("sold")}
                                value={this.state.sold}
                                placeholder="Sold"
                            />
                            <input
                                onChange={this.update("appraised")}
                                value={this.state.appraised}
                                placeholder="Appraised"
                            />
                            <button type="submit">Create Item</button>
                        </form>
                        <p>{this.state.message}</p>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;