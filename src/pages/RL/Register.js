import React, {useState} from 'react'
import './rl.css'
import {UserOutlined ,VerifiedOutlined } from '@ant-design/icons';
import Input from '../../components/Input'
import encrypt from '../../tools/AES'
import ajax from '../../tools/ajax';
import { message } from 'antd';
import useKey from './useKey';
export default function Register(props) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [accountPW, setAccountPW] = useState('')
    const [isForbid, setForbid] = useState(true)
    const [isError, setIsError] = useState(false)
    const key = useKey('')
    const submit = function(){
        const data = {
            username: account,
            password: encrypt(password,key.current),
            accountPW: encrypt(accountPW,key.current)
        }
        ajax('POST', '/rl/register', data).then((response) => {
            if(response.data.code === 0){
                setPassword('')
                setRePassword('')
                setForbid(true)
                message.error('Error:' + response.data.msg)
            } else {
                message.success(response.data.msg + '3秒之后自动跳转到登录页面')
                setTimeout(()=>{
                    props.history.replace('/rl/login')
                },3000)
            }
        })
    }
    const inputHandler = function(type, e){
        let forbid = false
        switch (type) {
            case 'account':{
                forbid = e.target.value && (password === rePassword) && accountPW
                setAccount(e.target.value)
                break;
            }
            case 'password':{
                forbid = (e.target.value === rePassword) && account  && accountPW
                setPassword(e.target.value)
                break;
            }
            case 'rePassword': {
                setRePassword(e.target.value)
                console.log(e.target.value===password)
                if(e.target.value === password) {
                    setIsError(false)
                    forbid = account && accountPW && e.target.value
                } else {
                    setIsError(true)
                    forbid = false
                }
                break;
            }
            case 'accountPW': {
                forbid = e.target.value && (password === rePassword) && account
                setAccountPW(e.target.value)
                break
            }
            default:
                break;
        }
        setForbid(!forbid)
    }
    return (
        <div className='login-page'>
            <h2>用户注册</h2>
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
                <Input error={isError} icon={<VerifiedOutlined/>} input={{
                    placeholder:'请再次输入密码',
                    type:'password',
                    value: rePassword,
                    onChange:function(e){
                        inputHandler('rePassword', e)
                    }
                }} />
                <Input icon={<VerifiedOutlined/>} input={{
                    placeholder:'请设置账户密码',
                    type:'password',
                    value: accountPW,
                    onChange:function(e){
                        inputHandler('accountPW', e)
                    }
                }} />
                <button 
                    className={`submit ${isForbid ? 'forbiden' : ''}`} 
                    disabled={isForbid} 
                    onClick={submit}
                >提交</button>
            </div>
        </div>
    )
}
