import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import VendorList from './Vendorlist';
import UserList from './Userlist';
import Dashboard from './Dashboard';
import Companylist from './Companylist';
import Unitlist from './Unitlist';
import BillingForm from './BillingForm';
import Expenselist from './Expenselist';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Login}/>
                <Route path="/Dashboard" component={Dashboard}/>
                <Route path="/Vendorlist" component={VendorList}/>
                <Route path="/Userlist" component={UserList}/>
                <Route path="/Companylist" component={Companylist}/>
                <Route path="/Unitlist" component={Unitlist}/>
                <Route path="/BillingForm" component={BillingForm}/>
                <Route path="/Expenselist" component={Expenselist}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;