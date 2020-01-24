import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";

class Companylist extends Component {
    constructor(){
        super();
        this.state = { companylist : [] }
        this.updateCompany = this.updateCompany.bind(this);
        this.addCompany = this.addCompany.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/companylist')
            .then((response) => {
            response.data.map((val, i) => {     
                if(val.status)
                    response.data[i].status = "Active"
                else
                    response.data[i].status = "In-Active"
            })
            this.setState({
                companylist : this.state.companylist.concat(response.data) 
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
    handleValidation(editCompID){
        let formIsValid = true;
        if($("#editCompName-"+editCompID).val() ==''){
           formIsValid = false;
           alert("Company name Required");
        }
        if($("#editCompAdd-"+editCompID).val() ==''){
           formIsValid = false;
           alert("Company address Required");
        }
        return formIsValid;
    }
    updateCompany = (e, editCompID) => {
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        if(this.handleValidation(editCompID)){
            var compEditStatus = 0; 
            if($("#editCompStatus1-"+editCompID).is(':checked'))    compEditStatus =1;
             
            const paramdata ={
                compName:$("#editCompName-"+editCompID).val(),
                compAdd:$("#editCompAdd-"+editCompID).val(),
                compStatus:compEditStatus,
                compId:editCompID,
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/editCompany',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({companylist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        companylist : this.state.companylist.concat(response.data)
                    })
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
            })
        }
    }
    handleValidationAddCompany(){
        let redirectVar = null;
         if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        let formIsValid = true;
        if($("#addCompName").val() ==''){
           formIsValid = false;
           alert("Company name Required");
        }
        if($("#addCompAddress") ==''){
           formIsValid = false;
           alert("Company address Required");
        }
        return formIsValid;
    }
    addCompany = (e) => {
        if(this.handleValidationAddCompany()){
            var addStatus = 0; 
            if($("#addCompAddressStatus1").is(':checked'))    addStatus =1;
             
            const paramdata ={
                compName:$("#addCompName").val(),
                compAdd:$("#addCompAddress").val(),
                compstatus:addStatus,
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/addCompany',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({companylist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        companylist : this.state.companylist.concat(response.data)
                    })
                    $(".popup-overlay").click();
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
                alert("Deleting User Unsuccessful :(");
            })
        }
    }

    
    render(){
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
       
        let details = this.state.companylist.map((companylist) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{companylist.compID}</td>
                    <td style={{outline: "thin solid"}} key={companylist.compID}>{companylist.comp_name}</td>
                    <td style={{outline: "thin solid"}}>{companylist.address}</td>
                    <td style={{outline: "thin solid"}}>{companylist.status}</td>
                    <td style={{outline: "thin solid"}}>{companylist.updatedOn}</td>
                    <td style={{outline: "thin solid"}}>{companylist.CreatedUser}</td>
                    <td style={{outline: "thin solid"}}>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-warning"> Edit </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h3 align="center" style={{color: "grey"}}>{companylist.comp_name}</h3>
                                <br/>
                                <div className="vendor-edit-form">
                                    <input type="hidden" className="hidden" id={'editCompId-'+companylist.compID} value={companylist.compID} />
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input id={'editCompName-'+companylist.compID} type="text" className="form-control" defaultValue={companylist.comp_name}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Address</label>
                                        <input id={'editCompAdd-'+companylist.compID} type="text" className="form-control" defaultValue={companylist.address} ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Status</label><br/>
                                        <input type="radio" value="Active" id={'editCompStatus1-'+companylist.compID} name={'editCompStatus-'+companylist.compID} defaultChecked={companylist.status ==="Active"} /> Active
                                        <input type="radio" value="In-Active" id={'editVendorStatus0-'+companylist.compID} name={'editCompStatus-'+companylist.compID} defaultChecked={companylist.status ==="In-Active"}/> In-Active
                                    </div>
                                    <button onClick={(e) => this.updateCompany(e, companylist.compID)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
                                </div>
                             </span>
                        </Popup>
                    </td>
                </tr>
            )
        })
        
        
        return(
            <div>
                <Navbarheader />
                <div className="container">
                    <h3 align="center">Company List</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-primary">Add New Company</button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center">Add New Company<h3 style={{color: "grey"}}></h3></h2>
                                <br/>
                                <div className="company-add-form">
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input id="addCompName" type="text" className="form-control" name="addCompName" defaultValue=""></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Address</label>
                                        <input id="addCompAddress" type="text" className="form-control" name="addCompAddress" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Status</label>
                                        <br/>
                                        <input type="radio" value="Active" id="addCompAddressStatus1" className="addCompAddressStatus" name="addCompAddressStatus1" defaultChecked="1" /> Active
                                        <input type="radio" value="In-Active" id="addCompAddressStatus0" className="addCompAddressStatus"  name="addCompAddressStatus0" /> In-Active
                                    </div>
                                    <button onClick={(e) => this.addCompany(e)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                                <th bgcolor="grey">Company Id</th>
                                <th bgcolor="grey">Company Name</th>
                                <th bgcolor="grey">Company Address</th>
                                <th bgcolor="grey">Company Status</th>
                                <th bgcolor="grey">Company last Update Time</th>
                                <th bgcolor="grey">Company Updated By</th>
                                <th bgcolor="grey">Company Update</th>
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
export default Companylist;