import React from 'react'
import './index.css'
export default function index(props) {
    return (
        <div className={`input-wrap ${props.error ? 'error' : ''}`}>
            <span className='icon'>{props.icon}</span>
            <input {...props.input} className='text-input'></input>
        </div>
    )
}
