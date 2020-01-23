import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";

class Vendorlist extends Component {
    constructor(){
        super();
        this.state = { vendorlist : [] }
        this.updateVendor = this.updateVendor.bind(this);
        this.addVendor = this.addVendor.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/vendorlist')
            .then((response) => {
            response.data.map((val, i) => {     
                if(val.vendorstatus)
                    response.data[i].vendorstatus = "Active"
                else
                    response.data[i].vendorstatus = "In-Active"
            })
            this.setState({
                vendorlist : this.state.vendorlist.concat(response.data) 
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
    handleValidation(editVendorID){
        let formIsValid = true;
        if($("#editVendorName-"+editVendorID).val() ==''){
           formIsValid = false;
           alert("Vendor name Required");
        }
        if($("#editVendorGSTIN-"+editVendorID).val() ==''){
           formIsValid = false;
           alert("Vendor GSTIN Required");
        }
        return formIsValid;
    }
    updateVendor = (e, editVendorID) => {
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        if(this.handleValidation(editVendorID)){
            var veditStatus = 0; 
            if($("#editVendorStatus1-"+editVendorID).is(':checked'))    veditStatus =1;
             
            const paramdata ={
                vendorName:$("#editVendorName-"+editVendorID).val(),
                vendorGSTIN:$("#editVendorGSTIN-"+editVendorID).val(),
                vendorstatus:veditStatus,
                vendorExpenseType:$("#editVendorExpenseType-"+editVendorID).val(),
                vendorId:$("#editVendorId-"+editVendorID).val()
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/editVendor',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({vendorlist: []});
                    response.data.map((val, i) => {     
                        if(val.vendorstatus)
                            response.data[i].vendorstatus = "Active"
                        else
                            response.data[i].vendorstatus = "In-Active"
                    })
                    this.setState({
                        vendorlist : this.state.vendorlist.concat(response.data)
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
    handleValidationAddVendor(){
        let redirectVar = null;
         if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        let formIsValid = true;
        if($("#addVendorName").val() ==''){
           formIsValid = false;
           alert("Vendor name Required");
        }
        if($("#addVendorGSTIN") ==''){
           formIsValid = false;
           alert("Vendor GSTIN Required");
        }
        return formIsValid;
    }
    addVendor = (e) => {
        if(this.handleValidationAddVendor()){
            var addStatus = 0; 
            if($("#addVendorStatus1").is(':checked'))    addStatus =1;
             
            const paramdata ={
                vendorName:$("#addVendorName").val(),
                vendorGSTIN:$("#addVendorGSTIN").val(),
                vendorstatus:addStatus,
                vendorExpenseType:$("#addVendorExpenseType").val(),
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/addVendor',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({vendorlist: []});
                    response.data.map((val, i) => {     
                        if(val.vendorstatus)
                            response.data[i].vendorstatus = "Active"
                        else
                            response.data[i].vendorstatus = "In-Active"
                    })
                    this.setState({
                        vendorlist : this.state.vendorlist.concat(response.data)
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
       
        let details = this.state.vendorlist.map((vendorlist) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{vendorlist.vid}</td>
                    <td style={{outline: "thin solid"}} key={vendorlist.vendorName}>{vendorlist.vendorName}</td>
                    <td style={{outline: "thin solid"}}>{vendorlist.GSTIN}</td>
                    <td style={{outline: "thin solid"}}>{vendorlist.exp_type}</td>
                    <td style={{outline: "thin solid"}}>{vendorlist.vendorstatus}</td>
                    <td style={{outline: "thin solid"}}>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-warning"> Edit </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center"> Vendor Edit :<h3 style={{color: "grey"}}>{vendorlist.vendorName}</h3></h2>
                                <br/>
                                <div className="vendor-edit-form">
                                    <input type="hidden" className="hidden" id={'editVendorId-'+vendorlist.vid} value={vendorlist.vid} />
                                    <div className="form-group">
                                        <label>Vendor Name</label>
                                        <input id={'editVendorName-'+vendorlist.vid} type="text" className="form-control" name="vendorName" defaultValue={vendorlist.vendorName}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>GSTIN</label>
                                        <input id={'editVendorGSTIN-'+vendorlist.vid} type="text" className="form-control" name="vendorGSTIN" defaultValue={vendorlist.GSTIN} ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Expense Type</label>
                                        <input id={'editVendorExpenseType-'+vendorlist.vid} type="text" className="form-control" name="vendorExpenseType" defaultValue={vendorlist.exp_type} ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Status</label><br/>
                                        <input type="radio" value="Active" id={'editVendorStatus1-'+vendorlist.vid} className={'editVendorStatus-'+vendorlist.vid} name={'editVendorStatus-'+vendorlist.vid} defaultChecked={vendorlist.vendorstatus ==="Active"} /> Active
                                        <input type="radio" value="In-Active" id={'editVendorStatus0-'+vendorlist.vid} className={'editVendorStatus-'+vendorlist.vid}  name={'editVendorStatus-'+vendorlist.vid} defaultChecked={vendorlist.vendorstatus ==="In-Active"}/> In-Active
                                    </div>
                                    <button onClick={(e) => this.updateVendor(e, vendorlist.vid)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                    <h3 align="center">Vendor List</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-primary">  Add new Vendor </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center">Add New Vendor<h3 style={{color: "grey"}}></h3></h2>
                                <br/>
                                <div className="vendor-add-form">
                                    <div className="form-group">
                                        <label>Vendor Name</label>
                                        <input id="addVendorName" type="text" className="form-control" name="addVendorName" defaultValue=""></input>
                                    </div>
                                    <div className="form-group">
                                        <label>GSTIN</label>
                                        <input id="addVendorGSTIN" type="text" className="form-control" name="addVendorGSTIN" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Expense Type</label>
                                        <input id="addVendorExpenseType" type="text" className="form-control" name="addVendorExpenseType" defaultValue="" ></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Vendor Status</label>
                                        <br/>
                                        <input type="radio" value="Active" id="addVendorStatus1" className="addVendorStatus" name="addVendorStatus1" defaultChecked="1" /> Active
                                        <input type="radio" value="In-Active" id="addVendorStatus0" className="addVendorStatus"  name="addVendorStatus0" /> In-Active
                                    </div>
                                    <button onClick={(e) => this.addVendor(e)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                                <th bgcolor="grey">Sr. No</th>
                                <th bgcolor="grey">Vendor Name</th>
                                <th bgcolor="grey">GSTIN</th>
                                <th bgcolor="grey">Expense Type</th>
                                <th bgcolor="grey">Vendor Status</th>
                                <th bgcolor="grey">Update Vendor</th>
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

 
export default Vendorlist;