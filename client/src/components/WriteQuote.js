import React, { Component } from 'react';

import "../styles/WriteQuote.scss"

class WriteQuote extends Component {
    render() {
        return (
            <div id="writing">
                <div id="beginning">
                    {this.props.quote.beginning + "... "}
                </div>
                <input 
                    type="text"
                    id="quoteEnd"
                    name="quoteEnd"
                />
                <button onClick={()=>{this.props.quote.end = document.getElementById("quoteEnd").value; this.props.sendRequest(this.props.quote);}}>Submit</button>
            </div>
        )
    } 
} export default WriteQuote;
