import React, { Component } from 'react';

import _ from 'lodash'
import './styles.scss'


class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : _.uniqueId('input_'),
            helperText: ""
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        
        const { pattern, min, max, message } = this.props;
        const value = event.target.value;
        
        if(pattern && value && !value.match(pattern)) this.setState({helperText: message || "Input is invalid."})
        else if(min && value && parseInt(value) < min) this.setState({helperText:`Value must be greater than or equal to ${min}`})
        else if(max && value && parseInt(value) > max) this.setState({helperText:`Value must be less than or equal to ${max}`})
        else this.setState({helperText: ""})
        
        this.props.onChange(event);
    }

    render() {
        const { label, id, onChange, ...rest } = this.props
        return (
            <div className="wordsmyth_input" id={id} {...rest}>
                {label && <label htmlFor={this.state.id}>{label}</label>}
                <input
                    id={this.state.id}
                    onChange={this.onChange}
                    {...rest}
                />
                {this.state.helperText.length > 0 && <span className="error">{this.state.helperText}</span>}
            </div>
        )
    }
} export default Input;