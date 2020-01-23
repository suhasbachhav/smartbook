import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import md5 from 'md5';
import logo from '../smartbook.png';

//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            authFlag : false
        }
        cookie.remove('cookie', { path: '/' });
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    handleValidation(){
        let formIsValid = true;
        if(!this.state.username){
           formIsValid = false;
           alert("Login ID is a Required field");
        }
        if(!this.state.password){
            formIsValid = false;
            alert("Password is a Required field");
        }
       return formIsValid;
   }
   submitLogin = (e) => {
        e.preventDefault();
        if(this.handleValidation()){
            const data = {
                username : this.state.username,
                password : md5(this.state.password)
            }
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/login',data)
                .then(response => {
                    console.log("Status Code : ",response.status);
                    if(response.status === 200){
                        this.setState({
                            authFlag : true
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        authFlag : false
                    });
                    console.log(error);
                    alert("Please enter correct details!");
                })
        }
    }

    render(){
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/dashboard"/>
        }
        return(
            <div>
                {redirectVar}
                <div className="container">
                <div className="col-sm-4 col-sm-offset-4">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 align="center"> Login</h1>
                    <br/>
                    <div className="login-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input onChange = {this.usernameChangeHandler} type="text" className="form-control" name="username" ></input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input onChange = {this.passwordChangeHandler} type="password" className="form-control" name="password" ></input>
                        </div>
                        <button onClick = {this.submitLogin} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Submit</button> 
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default Login;