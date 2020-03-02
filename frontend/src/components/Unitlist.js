import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";

class Unitlist extends Component {
    constructor(){
        super();
        this.state = { 
            unitlist : [],
            companylist :[] 
        }
        this.updateUnit = this.updateUnit.bind(this);
        this.addUnit = this.addUnit.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/unitlist')
            .then((response) => {
            response.data.map((val, i) => {     
                if(val.status)
                    response.data[i].status = "Active"
                else
                    response.data[i].status = "In-Active"
            })
            this.setState({
                unitlist : this.state.unitlist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/companylist')
            .then((response) => {
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
    handleValidation(editUnitID){
        let formIsValid = true;
        if($("#editUnitNumber-"+editUnitID).val() ==''){
           formIsValid = false;
           alert("Unit Number Required");
        }
        return formIsValid;
    }
    updateUnit = (e, editUnitID) => {
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        if(this.handleValidation(editUnitID)){
            var unitEditStatus = 0; 
            if($("#editUnitStatus1-"+editUnitID).is(':checked'))    unitEditStatus =1;
             
            const paramdata ={
                unitId:$("#editUnitId-"+editUnitID).val(),
                unitNumber:$("#editUnitNumber-"+editUnitID).val(),
                unitCompany:$("#editUnitCompany-"+editUnitID).val(),
                unitStatus:unitEditStatus,
                logId:cookie.load('uid')
            }

            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/editUnit',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({unitlist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        unitlist : this.state.unitlist.concat(response.data)
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
    addUnit = (e) => {
        if(this.handleValidationAddCompany()){
            var addStatus = 0; 
            if($("#addUnitStatus1").is(':checked'))    addStatus =1;
             
            const paramdata ={
                unitName:$("#addUnitName").val(),
                unitCompany:$("#addUnitCompany").val(),
                unitStatus:addStatus,
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/addUnit',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({unitlist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        unitlist : this.state.unitlist.concat(response.data)
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
        let companylistDropDown = this.state.companylist.map((companylist) => {
            return(
                <option value={companylist.compID}>{companylist.comp_name}</option>
            )
        })
       
        let details = this.state.unitlist.map((unitlist) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{unitlist.coID}</td>
                    <td style={{outline: "thin solid"}} key={unitlist.compName}>{unitlist.compName}</td>
                    <td style={{outline: "thin solid"}}>{unitlist.compAdd}</td>
                    <td style={{outline: "thin solid"}}>{unitlist.unitno}</td>
                    <td style={{outline: "thin solid"}}>{unitlist.status}</td>
                    <td style={{outline: "thin solid"}}>{unitlist.updatedOn}</td>
                    <td style={{outline: "thin solid"}}>{unitlist.CreatedUser}</td>
                    <td style={{outline: "thin solid"}}>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-warning"> Edit </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h3 align="center" style={{color: "grey"}}>{unitlist.comp_name}</h3>
                                <br/>
                                <div className="vendor-edit-form">
                                    <input type="hidden" className="hidden" id={'editUnitId-'+unitlist.coID} value={unitlist.coID} />
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input id={'editUnitNumber-'+unitlist.coID} type="text" className="form-control" defaultValue={unitlist.unitno}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Company</label>
                                        <select defaultValue={unitlist.companyId} id={'editUnitCompany-'+unitlist.coID} className="form-control" >
                                            {companylistDropDown} 
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Status</label><br/>
                                        <input type="radio" value="Active" id={'editUnitStatus1-'+unitlist.coID} name={'editUnitStatus-'+unitlist.coID} defaultChecked={unitlist.status ==="Active"} /> Active
                                        <input type="radio" value="In-Active" id={'editUnitStatus0-'+unitlist.coID} name={'editUnitStatus-'+unitlist.coID} defaultChecked={unitlist.status ==="In-Active"}/> In-Active
                                    </div>
                                    <button onClick={(e) => this.updateUnit(e, unitlist.coID)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                    <h3 align="center">Unit List</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-primary">Add New Unit</button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center">Add New Unit<h3 style={{color: "grey"}}></h3></h2>
                                <br/>
                                <div className="company-add-form">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input id="addUnitName" type="text" className="form-control" name="addUnitName" defaultValue=""></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Company</label>
                                        <select id="addUnitCompany" className="form-control" >
                                            <option value="0">--Select--</option>
                                            {companylistDropDown} 
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Status</label>
                                        <br/>
                                        <input type="radio" value="Active" id="addUnitStatus1" name="addUnitStatus" defaultChecked="1" /> Active
                                        <input type="radio" value="In-Active" id="addUnitStatus0" name="addUnitStatus" /> In-Active
                                    </div>
                                    <button onClick={(e) => this.addUnit(e)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                                <th bgcolor="grey">Unit</th>
                                <th bgcolor="grey">Company Name</th>
                                <th bgcolor="grey">Company Address</th>
                                <th bgcolor="grey">Unit Number</th>
                                <th bgcolor="grey">Unit Status</th>
                                <th bgcolor="grey">Unit last Update Time</th>
                                <th bgcolor="grey">Unit Updated By</th>
                                <th bgcolor="grey">Unit Update</th>
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
export default Unitlist;