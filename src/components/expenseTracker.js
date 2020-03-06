import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Modal, Icon, Table } from 'semantic-ui-react'

class expenseTracker extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false,
            balance: 0,
            totalIncome: 0,
            totalExpense: 0,
            transactions: [],
            description: null,
            date: null,
            amount: null,
            incomeOrExpense: null,
            warning: null
        }
    }

    componentDidMount(){
        let transactions = JSON.parse(localStorage.getItem('transactions'));
        let balance = localStorage.getItem('balance');
        let totalIncome = localStorage.getItem('totalIncome');
        let totalExpense = localStorage.getItem('totalExpense');
        this.setState({
            transactions: (transactions) ? transactions : []  ,
            balance: (balance) ? balance : 0,
            totalIncome: (totalIncome) ? totalIncome : 0,
            totalExpense: (totalExpense) ? totalExpense : 0
        });
    }

    addIncome = ()=>{
        this.setState({ open: true });
        this.setState({
            incomeOrExpense: 'income'
        })
    }

    addExpense = ()=>{
        this.setState({ open: true });
        this.setState({
            incomeOrExpense: 'expense'
        })
    }

    saveIncome = ()=>{
        if(this.state.description == null || this.state.date == null || this.state.amount != null){
            this.setState({
                warning: 'Please Enter all fields'
            })
        }else{
            let incomeData = {
                description: this.state.description,
                date: this.state.date,
                amount: this.state.amount,
                type: 'income'
            }
            let transactions = this.state.transactions;
            transactions.push(incomeData);
            let totalIncome = Number(this.state.totalIncome) + Number(incomeData['amount']);
            let balance = Number(totalIncome) - Number(this.state.totalExpense);
            this.setState({
                transactions: transactions,
                description: null,
                date: null,
                amount: null,
                totalIncome: totalIncome,
                balance: balance
            })
            localStorage.setItem('transactions', JSON.stringify(transactions));
            localStorage.setItem('balance', balance);
            localStorage.setItem('totalIncome', totalIncome);
            // localStorage.setItem('totalExpense', this.state.totalExpense)

            console.log(this.state.transactions);
            this.close()
        }
    }

    saveExpense = ()=>{
        if(this.state.description == null || this.state.date == null || this.state.amount != null){
            this.setState({
                warning: 'Please Enter all fields'
            })
        }else{
            let expenseData = {
                description: this.state.description,
                date: this.state.date,
                amount: this.state.amount,
                type: 'expense'
            }
            let transactions = this.state.transactions;
            transactions.push(expenseData);
            let totalExpense = Number(this.state.totalExpense) + Number(expenseData['amount']);
            let balance = Number(this.state.totalIncome) - Number(totalExpense);
            this.setState({
                transactions: transactions,
                description: null,
                date: null,
                amount: null,
                totalExpense: totalExpense,
                balance: balance
            })
            localStorage.setItem('transactions', JSON.stringify(transactions));
            localStorage.setItem('balance', balance);
            localStorage.setItem('totalExpense', totalExpense)
            this.close()
        }
    }

    show = (dimmer) => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false })

    setName = (event) => {
        this.setState({
            description: event.target.value
        });
    }

    setDate = (event) => {
        this.setState({
            date: event.target.value
        });
    }

    setAmount = (event) => {
        this.setState({
            amount: event.target.value
        });
    }

    delete = (key) => {
        console.log('key', key);
        let transactions = this.state.transactions;
        console.log('transactions', transactions);
        let deleteValue = transactions.splice(key, 1);
        console.log('deletevalue', deleteValue);
        let totalIncome = this.state.totalIncome;
        let totalExpense = this.state.totalExpense;
        let balance = this.state.balance;
        if(deleteValue[0]['type'] == 'expense'){
            totalExpense = Number(this.state.totalExpense) - Number(deleteValue[0]['amount']);
            balance = Number(this.state.totalIncome) - Number(totalExpense);
        }else{
            totalIncome = Number(this.state.totalIncome) - Number(deleteValue[0]['amount']);
            balance = Number(totalIncome) - Number(this.state.totalExpense);
            console.log('transactions', transactions);
        }
        this.setState({
            transactions: transactions,
            description: null,
            date: null,
            amount: null,
            totalExpense: totalExpense,
            balance: balance,
            totalIncome: totalIncome
        })
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('totalExpense', totalExpense);
        localStorage.setItem('totalIncome', totalIncome);
        console.log('key', key)
    }

    // calculateBalance = () => {
    //     if(this.state.transactions.length > 0){
    //         console.log('comes here')
    //         let transactions = this.state.transactions.length;
    //         let balance = this.state.balance;
    //         let totalIncome = this.state.totalIncome;
    //         let totalExpense = this.state.totalExpense;
    //         for(let i=0; i<transactions.length; i++){
    //             if(transactions[i]['type'] === 'income')
    //                 totalIncome = totalIncome + transactions[i]['amount']
    //             else
    //                 totalExpense = totalExpense + transactions[i]['amount'];
    //         }
    //         console.log('totalIncome', totalIncome);
    //         console.log('totalExpense', totalExpense);
    //     }
    // }

    render() {
        const { open, dimmer } = this.state;
        let transactions;
        if(this.state.transactions){
            transactions = this.state.transactions.map((data, key)=>{
                let date = data['date'];
                let description = data['description'];
                let amount = data['amount'];
                let amountColor = (data['type'] === 'income') ? 'green' : 'red'
                return(
                    <Table.Row>
                        {/* <List.Content floated='right'> */}
                        {/* </List.Content> */}
                        <Table.Cell>
                            <small>{date}</small><br/>
                            <span style={{color: amountColor}}>{amount}</span>
                        </Table.Cell>
                        <Table.Cell verticalAlign='bottom'>{description}</Table.Cell>
                        <Table.Cell verticalAlign='bottom float-right' onClick={this.delete.bind(this, key)}><Icon name="trash"></Icon></Table.Cell>
                    </Table.Row>
                )
            })
        }

        return (
            <div className='tablet'>
                <Modal size = 'mini' dimmer={dimmer} open={open} onClose={this.close}>
                <Modal.Header>Save {(this.state.incomeOrExpense === 'income') ? 'Income' : 'Expense'}</Modal.Header>
                    <div className='content'>
                        <Modal.Content >
                            {(this.state.warning != null) ? <Message color='red'>{this.state.warning}</Message> : ''}
                            <Form>
                                <Form.Field>
                                    <label>Description </label>
                                    <input placeholder='Description' maxLength='100' value={this.state.description} onChange={this.setName}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date </label>
                                    <input placeholder='Date' type = 'Date' value={this.state.date} onChange={this.setDate}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Amount </label>
                                    <input placeholder='Amount' type = 'number' value={this.state.amount} onChange={this.setAmount}/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                    </div>
                    <Modal.Actions>
                        {(this.state.incomeOrExpense === 'expense') ?
                            <Button color = 'red' content="Save Expense" onClick={this.saveExpense}/>
                            :
                            <Button positive content="Save Income" onClick={this.saveIncome}/>
                        }    
                        <Button color='black' onClick={this.close}>
                            CLOSE
                        </Button>

                    </Modal.Actions>
                </Modal>
                <Grid textAlign='center' style={{ height: '100%', alignContent: 'start', margin: 0 }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 530, padding: 0, margin: 0, height: '100%', position: 'relative' }}>
                        <div style={{ backgroundColor: 'lightgrey', padding: '10px 12px', textAlign: 'left', position: 'absolute', left: 0, top: 0, width: '100%' }}>
                            <span>Balance</span>
                            <h2>Rs.{this.state.balance}</h2>
                            <span style={{color: 'green'}}>Income&thinsp;</span><span style={{color: 'green'}}>Rs.{this.state.totalIncome}</span>&emsp;&emsp;<span style={{color: 'red'}}>Spendings</span><span style={{color: 'red'}}>&thinsp;Rs.{this.state.totalExpense}</span>
                        </div>
                        <div style={{padding: '15px', height: 'calc(100% - 175px)', position: 'relative', top: 127, overflowY: 'auto' }}>
                            <Table basic='very'>
                                <Table.Body>
                                    {transactions}
                                </Table.Body>
                            </Table>
                        </div>
                        <div style={{ width: '100%', maxWidth: 530, position: 'absolute', bottom: 0, left: 0, padding: '10px 0', backgroundColor: 'white', borderTop: '1px solid #aaa'}}>
                            <Button color = 'green' onClick={this.addIncome} style={{ border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000', marginRight: 10}}>Add Income</Button>  
                            <Button color = 'red' onClick={this.addExpense} style={{ border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000'}}>Add Expense</Button>  
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default expenseTracker
