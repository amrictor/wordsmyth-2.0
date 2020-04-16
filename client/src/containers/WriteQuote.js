import React, { Component } from 'react';
import Input from '../components/Input/index';

import "../styles/WriteQuote.scss"

class WriteQuote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quote: props.quote
        }
        this.setQuote = this.setQuote.bind(this);
    }

    setQuote(event) {
        let { quote } = this.props
        quote.end = event.target.value;
        this.setState({quote})
    }

    render() {
        return (
            <div id="writing">
                <div id="beginning">
                    {this.props.quote.beginning + "... "}
                </div>
                <Input 
                    type="text"
                    id="quoteEnd"
                    disabled={this.props.disabled}
                    onChange={this.setQuote}
                />
                <button disabled={this.props.disabled} onClick={()=>{this.props.sendRequest(this.state.quote);}}>Submit</button>
            </div>
        )
    } 
} export default WriteQuote;
