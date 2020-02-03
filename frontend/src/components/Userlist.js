import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";
import md5 from 'md5';

class Userlist extends Component {
    constructor(){
        super();
        this.state = { 
            userlist : [],
            userRollList:[]
        }
        this.updateUser = this.updateUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.checkUser = this.checkUser.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/userlist')
            .then((response) => {
            response.data.map((val, i) => {     
                if(val.status)
                    response.data[i].status = "Active"
                else
                    response.data[i].status = "In-Active"
            })
            this.setState({
                userlist : this.state.userlist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/userrolllist')
            .then((response) => {
            this.setState({
                userRollList : this.state.userRollList.concat(response.data) 
            })
        })
    }
    state = { show: false };

    showModal = () => {
    this.setState({ show: true });
    };

    hideModal = () => {
    this.setState({ show: false });
    };

    logout = () => {
        cookie.remove('cookie', {path: '/'})
        console.log("Cookie removed!")
        window.location = "/"
    }
    handleValidation(editUserID){
        let redirectVar = null;
         if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        let formIsValid = true;
        if($("#editName-"+editUserID).val() ==''){
           formIsValid = false;
           alert("User name Required");
        }
        if($("#editEmail--"+editUserID).val() ==''){
           formIsValid = false;
           alert("User Email Required");
        }
        return formIsValid;
    }
    updateUser = (e, editUserID) => {
        if(this.handleValidation(editUserID)){
            var ueditStatus = 0; 
            if($("#editUserStatus1-"+editUserID).is(':checked'))    ueditStatus =1;
             
            const paramdata ={
                userId:$("#editUserId-"+editUserID).val(),
                userName:$("#editName-"+editUserID).val(),
                userEmail:$("#editEmail-"+editUserID).val(),
                userStatus:ueditStatus,
                userRoll:$("#editUserRoll-"+editUserID).val(),
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/editUser',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({userlist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        userlist : this.state.userlist.concat(response.data)
                    })
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                alert("Deleting User Unsuccessful :(");
            })
        }
    }
    handleValidationAddUser(){
        let redirectVar = null;
         if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        let formIsValid = true;
        if($("#adduName").val() ==''){
           formIsValid = false;
           alert("User name is Required");
        }
        if($("#addName").val() ==''){
           formIsValid = false;
           alert("Name is Required");
        }
        if($("#addEmail").val() ==''){
           formIsValid = false;
           alert("Email is Required");
        }
        var email = $("#addEmail").val();
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
            formIsValid = false;
            alert("Invalid Email!");
        }

        if($("#addUserRoll").val() == 0){
           formIsValid = false;
           alert("Select User Roll");
        }
        if($("#addPassword").val() ==''){
           formIsValid = false;
           alert("Password is Required");
        }
        if($("#addPassword").val() != $("#addConfirmPassword").val()){
           formIsValid = false;
           $("#addPassword").val('')
           $("#addConfirmPassword").val('')
           alert("Password Must be same");
        }
        return formIsValid;
    }
    checkUser = (e) =>{
        const paramdata ={
            userName:$("#adduName").val()
        }
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:5001/checkUser',paramdata)
        .then(response => {
            if(response.status === 200){
                alert("Username allready exist!");
                //alert("Username allready exist!");
            }
        })
        .catch(error => {
            console.log("In error");
            console.log(error);
           
        })


    }
    addUser = (e) => {
        if(this.handleValidationAddUser()){
            var addStatus = 0; 
            if($("#addUserStatus1").is(':checked')) addStatus =1;
            //cookie.load('cookie')
            const paramdata ={
                userName:$("#adduName").val(),
                userFullName:$("#addName").val(),
                userEmail:$("#addEmail").val(),
                userRoll:$("#addUserRoll").val(),
                userPassword:md5($("#addPassword").val()),
                userStatus:addStatus,
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/addUser',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({userlist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        userlist : this.state.userlist.concat(response.data)
                    })
                    $(".popup-overlay").click();
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                alert("Error in adding user :(");
            })
        }
    }

    
    render(){
        let sessionUserId = [];
        sessionUserId.push(cookie.load('uid'));
        let userRollEditDropDown = this.state.userRollList.map((userRollList) => {
            return(
              <option value={userRollList.access}>{userRollList.userrollname}</option>
            )
        })
        
        
        let details = this.state.userlist.map((userlist) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{userlist.id}</td>
                    <td style={{outline: "thin solid"}} key={userlist.username}>{userlist.username}</td>
                    <td style={{outline: "thin solid"}} key={userlist.name}>{userlist.name}</td>
                    <td style={{outline: "thin solid"}}>{userlist.email}</td>
                    <td style={{outline: "thin solid"}}>{userlist.uRollName}</td>
                    <td style={{outline: "thin solid"}}>{userlist.createdUser}</td>
                    <td style={{outline: "thin solid"}}>{userlist.lastLogin}</td>
                    <td style={{outline: "thin solid"}}>{userlist.status}</td>
                    <td style={{outline: "thin solid"}}>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-warning"> Edit </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center"> User Edit :</h2><h3 style={{color: "grey"}}>{userlist.vendorName}</h3>
                                <br/>
                                <div className="vendor-edit-form">
                                    <input type="hidden" className="hidden" id={'editUserId-'+userlist.id} value={userlist.id} />
                                    <input type="hidden" className="hidden" id={'editUpdatedBy-'+userlist.id} value={sessionUserId} />
                                    <div className="form-group">
                                        <label>User Name</label>
                                        <input id={'editUName-'+userlist.id} type="text" className="form-control" defaultValue={userlist.username} disabled></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input id={'editName-'+userlist.id} type="text" className="form-control" defaultValue={userlist.name}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input id={'editEmail-'+userlist.id} type="text" className="form-control" defaultValue={userlist.email}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>User Roll</label>
                                        <select defaultValue={userlist.userroll} id={'editUserRoll-'+userlist.id} className="form-control" >
                                            {userRollEditDropDown} 
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>User Status</label><br/>
                                        <input type="radio" value="Active" id={'editUserStatus1-'+userlist.id} name={'editUserStatus-'+userlist.id} defaultChecked={userlist.status ==="Active"} /> Active
                                        <input type="radio" value="In-Active" id={'editUserStatus0-'+userlist.id} name={'editUserStatus-'+userlist.id} defaultChecked={userlist.status ==="In-Active"}/> In-Active
                                    
                                    </div>
                                    <button onClick={(e) => this.updateUser(e, userlist.id)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
                                </div>
                             </span>
                        </Popup>
                    </td>
                </tr>
            )
        })

        let userRollDropDown = this.state.userRollList.map((userRollList) => {
            return(
              <option value={userRollList.access}>{userRollList.userrollname}</option>
            )
        })
        
        return(
            <div>
                <Navbarheader />
                <div className="container">
                    <h3 align="center">User List</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-primary">  Add new User </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center">Add New User<h3 style={{color: "grey"}}></h3></h2>
                                <br/>
                                <div className="vendor-add-form">
                                    <div className="form-group">
                                        <label>User Name</label>
                                        <input id="adduName" onChange={(e) => this.checkUser(e)} type="text" className="form-control" name="adduName" defaultValue=""></input>
                                        <span id="userNameMessage" className="hidden" style={{color: "red"}}>*Username allready exist!</span>
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input id="addName" type="text" className="form-control" name="addName" defaultValue=""></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input id="addEmail" type="email" className="form-control" name="addEmail" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>User roll</label>
                                        <select id="addUserRoll" name="addUserRoll" className="form-control" >
                                            <option value="0">--Select--</option>
                                            {userRollDropDown} 
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input id="addPassword" type="password" className="form-control" name="addPassword" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input id="addConfirmPassword" type="text" className="form-control" name="addConfirmPassword" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Status</label>
                                        <br/>
                                        <input type="radio" value="Active" id="addUserStatus1" name="addUserStatus" defaultChecked="1" /> Active
                                        <input type="radio" value="In-Active" id="addUserStatus0" name="addUserStatus" /> In-Active
                                    </div>
                                    <button onClick={(e) => this.addUser(e)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
                                </div>
                             </span>
                        </Popup>


                   </h4>



                    </ul>
                </div>
                
                <div className="container">
                    <table className="table" style={{outline: "thin solid"}} border="1px solid black">
                        <thead>
                            <tr style={{outline: "thin solid"}}>
                                <th bgcolor="grey">U. Id</th>
                                <th bgcolor="grey">Username</th>
                                <th bgcolor="grey">Name</th>
                                <th bgcolor="grey">email</th>
                                <th bgcolor="grey">User Roll</th>
                                <th bgcolor="grey">Created / Updated By</th>
                                <th bgcolor="grey">Last login</th>
                                <th bgcolor="grey">Status</th>
                                <th bgcolor="grey">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details}   
                        </tbody>
                    </table>   
                </div> 
            </div> 
        )
    }
}

 
export default Userlist;