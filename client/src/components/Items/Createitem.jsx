import React, { Component } from "react";
import { Mutation } from "react-apollo";
import axios from 'axios';
import { CREATE_ITEM, UPDATE_ITEM_IMAGES, CREATE_CHAMPION } from "../../graphql/mutations";

import { Query } from "react-apollo";

import Queries from "../../graphql/queries";
const { FETCH_ITEMS, FETCH_CATEGORIES } = Queries;




class CreateItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            name: "",
            description: "",
            starting_price: 0,
            minimum_price: 0,
            category: "",
            sold: false,
            appraised: false,
            imageURLs: [],
            location: []
        };
        this.files = [];
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(e) {
        e.preventDefault();
        const files = Array.from(e.target.files);
        for (let i = 0; i < files.length; i++) {
            this.files.push(files[i]);
        }
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
        // this.setState({ category: e.target.options[e.target.selectedIndex].value })
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
    
    updateLocation(){
        return e => console.log("current location");
    }
    fetchCategories(){
        return <Query query={FETCH_CATEGORIES}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                return (
                    <select onChange={this.update("category")} value={this.state.category || "default"}>
                    <option value="default" disabled>--Please Select--</option>
                        {data.categories.map((category) => (
                            <option value={category.id} key={category.id}>{category.name}</option>
                        ))}
                    </select>
                );
            }}
        </Query>
    }

    async updateImageURLs() {
        const publicIdsArray = [];

        for (let i = 0; i < this.files.length; i++) {
            const formData = new FormData();
            formData.append('file', this.files[i]);
            formData.append('upload_preset', 'ml_default');
            const champion = await axios.post(
                'https://api.cloudinary.com/v1_1/chinweenie/image/upload',
                formData
            )
            
            publicIdsArray.push(champion.data.public_id);
        }
        return publicIdsArray;
    }

    async handleSubmit(e, newItem) {
        e.preventDefault();
        const championsArr = await this.updateImageURLs();
        newItem({
            variables: {
                name: this.state.name,
                description: this.state.description,
                starting_price: this.state.starting_price,
                minimum_price: this.state.minimum_price,
                category: this.state.category,
                sold: this.state.sold,
                appraised: this.state.appraised,
                location: this.state.location,
                champions: championsArr
            }
        }).then(item => {
            debugger
            console.log(item.data);
        })  
    }
      
    render() {
        const categories = this.fetchCategories();
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
                {(newItem) => {
                    return <div>

                        <form onSubmit={e => this.handleSubmit(e, newItem)}>
                            <input
                                onChange={this.update("name")}
                                value={this.state.name}
                                placeholder="Name"
                            />
                            <textarea
                                onChange={this.update("description")}
                                value={this.state.description}
                                placeholder="description"
                            />

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
                            <label>
                                Upload Images:
                                <input type="file" multiple onChange={this.onDrop} />
                            </label>

                            <label>
                                Sold:
                                <input
                                    onChange={this.update("sold")}
                                    value={this.state.sold}
                                    placeholder="Sold"
                                />
                            </label>
                            <label>
                                Appraised:
                                <input
                                    onChange={this.update("appraised")}
                                    value={this.state.appraised}
                                />
                            </label>

                            <label>
                                Category:
                                {categories}
                            </label>

                            <button type="submit">Create Item</button>
                        </form>
                        <p>{this.state.message}</p>
                    </div>
                }}
            </Mutation>
        );
    }

        
}

    


export default CreateItem;