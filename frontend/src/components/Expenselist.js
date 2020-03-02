import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";

class Expenselist extends Component {
    constructor(){
        super();
        this.state = { 
            expenselist : [],
        }
        this.updateExpense = this.updateExpense.bind(this);
        this.addExpense = this.addExpense.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/expenselist')
            .then((response) => {
            response.data.map((val, i) => {     
                if(val.status)
                    response.data[i].status = "Active"
                else
                    response.data[i].status = "In-Active"
            })
            this.setState({
                expenselist : this.state.expenselist.concat(response.data) 
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
    handleValidation(editExpenseID){
        let formIsValid = true;
        if($("#editExpenseName-"+editExpenseID).val() ==''){
           formIsValid = false;
           alert("Expense Value Required");
        }
        return formIsValid;
    }
    updateExpense = (e, editExpenseID) => {
        let redirectVar = null;
        if(!cookie.load('cookie')){
            return redirectVar = <Redirect to= "/" />
        }
        if(this.handleValidation(editExpenseID)){
            var expenseEditStatus = 0; 
            if($("#editExpenseStatus-"+editExpenseID).is(':checked'))    expenseEditStatus =1;
             
            const paramdata ={
                expenseId:$("#editExpenseId-"+editExpenseID).val(),
                expenseName:$("#editExpenseName-"+editExpenseID).val(),
                expenseStatus:expenseEditStatus,
                logId:cookie.load('uid')
            }

            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/editExpense',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({expenselist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        expenselist : this.state.expenselist.concat(response.data)
                    })
                }
            })
            .catch(error => {
                console.log("In error");
                console.log(error);
            })
        }
    }
    handleValidationAddExpense(){
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
    addExpense = (e) => {
        if(this.handleValidationAddExpense()){
            var addStatus = 0; 
            if($("#addExpenseStatus1").is(':checked'))    addStatus =1;
             
            const paramdata ={
                expenseName:$("#addExpenseName").val(),
                expenseStatus:addStatus,
                logId:cookie.load('uid')
            }
            e.preventDefault();
           
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:5001/addExpense',paramdata)
            .then(response => {
                if(response.status === 200){
                    this.setState({expenselist: []});
                    response.data.map((val, i) => {     
                        if(val.status)
                            response.data[i].status = "Active"
                        else
                            response.data[i].status = "In-Active"
                    })
                    this.setState({
                        expenselist : this.state.expenselist.concat(response.data)
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
       
        let details = this.state.expenselist.map((expenselist) => {
            return(
                <tr>
                    <td style={{outline: "thin solid"}}>{expenselist.expId}</td>
                    <td style={{outline: "thin solid"}} key={expenselist.expName}>{expenselist.expName}</td>
                    <td style={{outline: "thin solid"}}>{expenselist.status}</td>
                    <td style={{outline: "thin solid"}}>{expenselist.updatedOn}</td>
                    <td style={{outline: "thin solid"}}>{expenselist.CreatedUser}</td>
                    <td style={{outline: "thin solid"}}>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-warning"> Edit </button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h3 align="center" style={{color: "grey"}}>{expenselist.expName}</h3>
                                <br/>
                                <div className="vendor-edit-form">
                                    <input type="hidden" className="hidden" id={'editExpenseId-'+expenselist.expId} value={expenselist.expId} />
                                    <div className="form-group">
                                        <label>Expense Name</label>
                                        <input id={'editExpenseName-'+expenselist.expId} type="text" className="form-control" defaultValue={expenselist.expName}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Expense Status</label><br/>
                                        <input type="radio" value="Active" id={'editExpenseStatus1-'+expenselist.expId} name={'editExpenseStatus-'+expenselist.expId} defaultChecked={expenselist.status ==="Active"} /> Active
                                        <input type="radio" value="In-Active" id={'editExpenseStatus0-'+expenselist.expId} name={'editExpenseStatus-'+expenselist.expId} defaultChecked={expenselist.status ==="In-Active"}/> In-Active
                                    </div>
                                    <button onClick={(e) => this.updateExpense(e, expenselist.expId)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Update</button> 
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
                    <h3 align="center">Expense List</h3>
                    <ul className="nav nav-pills">
                    <h4>
                        <Popup trigger={<button style={{margin: "2px"}} className="button btn btn-primary">Add New Expenses</button>}  modal  closeOnDocumentClick >
                            <span> 
                                <h2 align="center">Add New Expense<h3 style={{color: "grey"}}></h3></h2>
                                <br/>
                                <div className="company-add-form">
                                    <div className="form-group">
                                        <label>Expense Name</label>
                                        <input id="addExpenseName" type="text" className="form-control" name="addExpenseName" defaultValue=""></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Expense Status</label>
                                        <br/>
                                        <input type="radio" value="Active" id="addExpenseStatus1" name="addExpenseStatus" defaultChecked="1" /> Active
                                        <input type="radio" value="In-Active" id="addExpenseStatus0" name="addExpenseStatus" /> In-Active
                                    </div>
                                    <button onClick={(e) => this.addExpense(e)} type="submit" className="btn btn-lg btn-success" style={{position: 'relative'}}>Add</button> 
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
                                <th bgcolor="grey">Expense Id</th>
                                <th bgcolor="grey">Expense Name</th>
                                <th bgcolor="grey">Expense Status</th>
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
export default Expenselist;