import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';

const { FETCH_ITEMS } = queries;

class ItemShow extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentUsers: [],
            userActivity: [],
            username: null,
            text: ''
        };
        this.timer = false;
    }
    countDown(endTime){
        const that = this;
        // Update the count down every 1 second
        var x = setInterval(() => {

            // Get today's date and time
            var now = new Date().getTime();
            // Find the distance between now and the count down date
            var distance = endTime - now;
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="timer"
            const timer = document.getElementById("timer");
            if(!timer)
                return;
            timer.innerHTML = "Auction is due in: " + days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";

            // If the count down is finished, write some text
            if (that.timer || distance < 0) {
                clearInterval(x);
                timer.innerHTML = "Auction is EXPIRED";
            }
        }, 1000);
    }
    
    render() {
        const { username } = this.state;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    const countdownMinutes = item.endTime || 3;
                    this.countDown(countdownMinutes);
                    const images = item.champions.map(champion => {
                        return <li>
                            <Image cloudName='chinweenie' publicId={champion}/>
                        </li>
                    })
                    return (
                        <div>
                            <h1>The item name is: {item.name}</h1>
                            <p>{item.description}</p>
                            <h3 id="timer"></h3>
                            <ul>
                                {images}
                            </ul>
                            <Link to={`${this.props.match.params.id}/edit`} > Edit Item</Link>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(ItemShow);