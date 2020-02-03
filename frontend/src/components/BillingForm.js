import React, {Component} from 'react';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navbarheader from './Navbarheader';
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class BillingForm extends Component {
    constructor(){
        super();
        this.state = { 
            unitlist : [],
            companylist :[],
            vendorlist:[],
            monthlist:[],
            paidStatuslist:[],
            expenseslist:[],
            billReceiveDate: new Date(),
            chequeDate: new Date(),
            billingDate: new Date(),
            billingPeriodFromDate: new Date(),
            billingPeriodToDate: new Date()
        }
        //this.updateUnit = this.updateUnit.bind(this);
        this.showUnit = this.showUnit.bind(this);
        this.addBill = this.addBill.bind(this);
        this.clearBill = this.clearBill.bind(this);
        this.getGSTNumber = this.getGSTNumber.bind(this);
    }
    componentDidMount(){
        axios.get('http://localhost:5001/activeCompanyList')
            .then((response) => {
            this.setState({
                companylist : this.state.companylist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/activeVendorList')
            .then((response) => {
            this.setState({
                vendorlist : this.state.vendorlist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/monthlist')
            .then((response) => {
            this.setState({
                monthlist : this.state.monthlist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/paidStatuslist')
            .then((response) => {
            this.setState({
                paidStatuslist : this.state.paidStatuslist.concat(response.data) 
            })
        })
        axios.get('http://localhost:5001/expenseslist')
            .then((response) => {
            this.setState({
                expenseslist : this.state.expenseslist.concat(response.data) 
            })
        })
    }
    getGSTNumber = (e) => {
        e.preventDefault();
        var url = 'http://localhost:5001/getGSTNumber?vendorId='+e.target.value;
        axios.defaults.withCredentials = true;
        axios.get(url)
        .then(response => {
            if(response.status === 200){
                //console.log(response.data[0].GSTIN)
                $("#vGSTNumber").val(response.data[0].GSTIN)
            }
        })
        .catch(error => {
            console.log("In error");
            console.log(error);
        })
    }
    showUnit = (e) => {
        e.preventDefault();
        var url = 'http://localhost:5001/showUnitForCompany?CompanyId='+e.target.value;
        axios.defaults.withCredentials = true;
        axios.get(url)
        .then(response => {
            if(response.status === 200){
                this.setState({unitlist: []});
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
    addBill = (e) => {
        e.preventDefault();
    }
    clearBill = (e) => {
        e.preventDefault();
        $("#bCompanyId , #bVendorId , #bMonthId , #bPaidStatus , #bUnitId").val(0);
        $("#bNumber, #bBasicAmount, #bGST, #bExpenseHead, #bBillAmount, #bTDSPercent, #bTDSAmount, #bDebitNote, #bFinalAmount , #bTotalAmount ").val('');
    }
    handleBillReceiveChange = date => {
        this.setState({
            billReceiveDate: date
        });
    };
    handleBillingChange = date => {
        this.setState({
            billingDate: date
        });
    };
    handleChequeChange = date => {
        this.setState({
            chequeDate: date
        });
    };
    handleBillingPeriodFromChange = date => {
        this.setState({
            billingPeriodFromDate: date
        });
    };
    handleBillingPeriodToChange = date => {
        this.setState({
            billingPeriodToDate: date
        });
    };
        
   

    
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
        let unitlistDropDown = this.state.unitlist.map((unitlist) => {
            return(
              <option value={unitlist.coID}>{unitlist.unitno}</option>
            )
        })
        let vendorlistDropDown = this.state.vendorlist.map((vendorlist) => {
            return(
              <option value={vendorlist.vid}>{vendorlist.vendorName}</option>
            )
        })
        let monthlistDropDown = this.state.monthlist.map((monthlist) => {
            return(
              <option value={monthlist.mid}>{monthlist.monthName}</option>
            )
        })
        let paidStatuslistDropDown = this.state.paidStatuslist.map((paidStatuslist) => {
            return(
              <option value={paidStatuslist.id}>{paidStatuslist.pName}</option>
            )
        })
        let expenseslistDropDown = this.state.expenseslist.map((expenseslist) => {
            return(
              <option value={expenseslist.expId}>{expenseslist.expName}</option>
            )
        })

        return(
            <div>
                <Navbarheader />
                <div className="container">
                    <div className="row text-center">
                        <h3 className="text-center" align="center" style={{width: "100%"}}>Billing Form</h3>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>Company Name:</label>
                                    <select onChange={(e) => this.showUnit(e)} defaultValue='0' id="bCompanyId" className="form-control" >
                                        <option value='0'>----Select Company----</option>
                                        {companylistDropDown} 
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Company Address:</label>
                                    <select  defaultValue='0' id="bUnitId" className="form-control">
                                        <option value='0'>----Select Address----</option>
                                        {unitlistDropDown} 
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Expense Head:</label>
                                    <select  defaultValue='0' id="bExpenseHead" className="form-control">
                                        <option value='0'>----Select Expenses----</option>
                                        {expenseslistDropDown} 
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label >Bill receives Date:</label><br/>
                                    <DatePicker id="bReceivedDate" selected={this.state.billReceiveDate} className="form-control" onChange={this.handleBillReceiveChange} disabled/>
                                </div>
                                <div className="form-group">
                                    <label >Bill Date:</label><br/>
                                    <DatePicker id="bBillingDate" selected={this.state.billingDate} className="form-control" onChange={this.handleBillingChange} />
                                </div>
                                <div className="form-group">
                                    <label >Billing Period: (fromdate to todate)</label><br/>
                                    <DatePicker id="bBillingPeriodFromDate" selected={this.state.billingPeriodFromDate} className="form-control" onChange={this.handleBillingPeriodFromChange} />- to - 
                                    <DatePicker id="bBillingPeriodToDate" selected={this.state.billingPeriodToDate} className="form-control" onChange={this.handleBillingPeriodToChange} />
                                </div>
                                <div className="form-group">
                                    <label>Vendor:</label>
                                    <select onChange={(e) => this.getGSTNumber(e)} defaultValue='0' id="bVendorId" className="form-control">
                                        <option value='0'>----Select Vendor----</option>
                                        {vendorlistDropDown} 
                                    </select>
                                    <input type="hidden" className="hidden" id="vGSTNumber" />
                                </div>
                                <div className="form-group">
                                    <label>Bill Number:</label>
                                    <input id="bNumber" type="text" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Billing Month:</label>
                                    <select defaultValue='0' id="bMonthId" className="form-control">
                                        <option value='0'>----Select Month----</option>
                                        {monthlistDropDown} 
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Billing Year:</label>
                                    <select defaultValue='0' id="bYearId" className="form-control">
                                        <option value='0'>----Select Year----</option>
                                        <option value='2018'>2018</option>
                                        <option value='2019'>2019</option>
                                        <option value='2020'>2020</option>
                                        <option value='2021'>2021</option>
                                        <option value='2022'>2022</option>
                                        <option value='2023'>2023</option>
                                        <option value='2024'>2024</option>
                                        <option value='2025'>2025</option>
                                        <option value='2026'>2026</option>
                                        <option value='2027'>2027</option>
                                        <option value='2028'>2028</option>
                                        <option value='2029'>2029</option>
                                        <option value='2030'>2030</option>
                                    </select>
                                </div>
                                
                                
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>Basic Amount:</label>
                                    <input id="bBasicAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>GST/TAX:</label>
                                    <input id="bGST" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Bill Amount:</label>
                                    <input id="bBillAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>TDS %:</label>
                                    <input id="bTDSPercent" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>TDS Amount:</label>
                                    <input id="bTDSAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Total Amount:</label>
                                    <input id="bTotalAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Debit Note:</label>
                                    <input id="bDebitNote" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Final Amount:</label>
                                    <input id="bFinalAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Cheque Amount:</label>
                                    <input id="bChequeAmount" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Cheque Number:</label>
                                    <input id="bChequeNumber" type="number" className="form-control" defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label>Cheque Date:</label><br/>
                                    <DatePicker id="bChequeDate" selected={this.state.billReceiveDate} className="form-control" onChange={this.handleChequeChange} />
                                </div>
                                <div className="form-group">
                                    <label>Billing Month:</label>
                                    <select  defaultValue='0' id="bPaidStatus" className="form-control">
                                        <option value='0'>----Select Paid Status----</option>
                                        {paidStatuslistDropDown} 
                                    </select>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4"></div>
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 p-3">
                                        <button onClick={(e) => this.clearBill(e)} type="submit" className="col-lg-6 btn btn-lg btn-primary" style={{position: 'relative'}}>Clear</button> 
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 p-3">
                                        <button onClick={(e) => this.addBill(e)} type="submit" className="col-lg-6 btn btn-lg btn-success" style={{position: 'relative'}}>Submit</button> 
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4"></div>
                            </div>
                        </div>    
                    </div>




                </div>
                
                
            
            
            
            
            </div> 
        )
    }
}
export default BillingForm;