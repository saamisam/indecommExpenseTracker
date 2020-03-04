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
            incomeOrExpense: null
        }
    }

    componentDidMount(){
        // this.setState({
        //     transactions: JSON.parse(localStorage.getItem('transactions')),
        //     balance:localStorage.getItem('balance'),
        //     totalIncome:localStorage.getItem('totalIncome'),
        //     totalExpense:localStorage.getItem('totalExpense')
        // });
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

    saveExpense = ()=>{
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
                        <Table.Cell verticalAlign='bottom'><Icon name="trash"></Icon></Table.Cell>
                    </Table.Row>
                )
            })
        }

        return (
            <div>
                <Modal size = 'mini' dimmer={dimmer} open={open} onClose={this.close}>
                <Modal.Header>Save {(this.state.incomeOrExpense === 'income') ? 'Income' : 'Expense'}</Modal.Header>
                    <div className='content'>
                        <Modal.Content >
                            <Form>
                                <Form.Field>
                                    <label>Description </label>
                                    <input placeholder='Description' value={this.state.description} onChange={this.setName}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date </label>
                                    <input placeholder='Date' value={this.state.date} onChange={this.setDate}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Amount </label>
                                    <input placeholder='Amount' value={this.state.amount} onChange={this.setAmount}/>
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
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 530 }}>
                        <span>Balance</span><br/>
                        <span><bold>{this.state.balance}RS</bold></span><br/>
                        <span>Income</span><span>{this.state.totalIncome}RS</span><span>Expense</span><span>{this.state.totalExpense}</span>
                        <Table basic='very'>
                            <Table.Body>
                                {transactions}
                            </Table.Body>
                        </Table>
                        <Button color = 'green' onClick={this.addIncome}>Add Income</Button>  
                        <Button color = 'red' onClick={this.addExpense}>Add Expense</Button>  
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default expenseTracker
