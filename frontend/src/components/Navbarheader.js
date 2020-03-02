import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class Navbarheader extends Component{
    constructor(props){
        super(props);
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
    }
    logout = () => {
        cookie.remove('cookie', {path: '/'})
        window.location = "/"
    }
    render(){
      let redirectVar = null;
      if(!cookie.load('cookie')){
          return redirectVar = <Redirect to= "/" />
      }
      let userNameFld = [];
      let userfullname = [];
      userNameFld.push(cookie.load('userName'));
      userfullname.push(cookie.load('userfullname'));
      return(
           <div>
                <Navbar bg="light" expand="lg" style={{fontSize: '18px'}}>
                  <Navbar.Brand href="#home" style={{fontWeight: 'bold'}}><span style={{fontSize: '28px', color:'red'}}>Smart</span><span style={{fontSize: '18px'}}>Book</span></Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                      <Nav.Link href="/dashboard">Home</Nav.Link>
                      <NavDropdown title="Admin" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/vendorlist">Vendor Managment</NavDropdown.Item>
                        <NavDropdown.Item href="/userlist">User Managment</NavDropdown.Item>
                        <NavDropdown.Item href="/companylist">Company Managment</NavDropdown.Item>
                        <NavDropdown.Item href="/Unitlist">Unit Managment</NavDropdown.Item>
                        <NavDropdown.Item href="/Expenselist">Expenses Managment</NavDropdown.Item>
                      </NavDropdown>
                      <NavDropdown title="Billing Section" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/BillingForm">Billing form</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                    <Nav className="navbar-text">
                      <NavDropdown title={userfullname} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick= {this.logout}>Logout</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}
export default Navbarheader;