import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount () {
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(err =>{
                this.setState({loading: false});
            });
    }

    render () {
        let orders = this.state.orders.map(order => (
            <Order 
                key={order.id} 
                ingredients={order.ingredients}
                price={order.price}/>
        ));
        if (this.state.orders.length === 0) {
            orders = <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '22px'}}>You Have Got No Orders Yet!</p>
        }

        if (this.state.loading){
            orders = <Spinner />
        }
        return (
            <div>
               {orders}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);