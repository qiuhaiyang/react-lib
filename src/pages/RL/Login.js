import React, {useState} from 'react'
import './rl.css'
import {Link} from 'react-router-dom'
import {UserOutlined ,VerifiedOutlined } from '@ant-design/icons';
import Input from '../../components/Input'
import encrypt from '../../tools/AES'
import ajax from '../../tools/ajax';
import { message } from 'antd';
import useKey from './useKey';
export default function Login(props) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [isForbid, setForbid] = useState(true)
    const key = useKey('')
    const submit = function(){
        const data = {
            username: account,
            password: encrypt(password,key.current)
        }
        ajax('POST', '/rl/login', data).then((response) => {
            if(response.data.code === 0){
                setPassword('')
                setForbid(true)
                message.error('Error:' + response.data.msg)

            } else {
                sessionStorage.setItem('authorization', response.data.data)
                props.history.replace('/home')
            }
        })
    }
    const inputHandler = function(type, e){
        let forbid = false
        switch (type) {
            case 'account':{
                forbid = e.target.value && password
                setAccount(e.target.value)
                break;
            }
            case 'password':{
                forbid = e.target.value && account
                e.target.value ? setPassword(e.target.value) : setPassword('')
                break;
            }
            default:
                break;
        }
        setForbid(!forbid)
    }
    return (
        <div className='login-page'>
            <h2>图书馆登录</h2>
            <div className='msg-form'>
                <Input icon={<UserOutlined/>} input={{
                    placeholder:'用户名',
                    onChange:function(e){
                        inputHandler('account', e)
                    }
                }} />
                <Input icon={<VerifiedOutlined/>} input={{
                    placeholder:'密码',
                    type:'password',
                    value: password,
                    onChange:function(e){
                        inputHandler('password', e)
                    }
                }} />
                <button 
                    className={`submit ${isForbid ? 'forbiden' : ''}`} 
                    disabled={isForbid} 
                    onClick={submit}
                >提交</button>
                <div className='detail'>
                    <Link to='/rl/register'>注册账户</Link>
                    <Link to='/rl/forget'>忘记密码</Link>
                </div>
            </div>
        </div>
    )
}
