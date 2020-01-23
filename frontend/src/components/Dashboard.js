import React, {Component} from 'react';
import axios from 'axios';
import $ from 'jquery';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import 'bootstrap/dist/css/bootstrap.min.css';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            posted : false
        }
       
    }
    componentWillMount(){
        this.setState({
            posted : false
        })
    }
    
    
    logout = () => {
        cookie.remove('cookie', {path: '/'})
        console.log("Cookie removed!")
        window.location = "/"
    }
    clearForm = (e) => {
        document.getElementById("create-user-form").reset();
    }
    render(){
       let redirectVar = null;
       if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
       }
       if (this.state.posted){
            redirectVar = <Redirect to= "/vendorlist"/>
       }
       let userNameFld = [];
       userNameFld.push(cookie.load('userName'));
       return(
           <div>
               <Navbarheader />
                <div className="col-md-5 col-md-offset-5">
                    <h3> User Information</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        {/*<a href="/vendorlist">Vendor List</a>*/}
                        <a id="logoutId" style={{float: "right"}} href="#" onClick= {this.logout} >Logout </a>
                    </h4>
                    </ul>
                </div>
                
        </div>
        )
    }
}
export default Dashboard;