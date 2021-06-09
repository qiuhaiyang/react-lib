import React, {useState} from 'react'
import './rl.css'
import {UserOutlined ,VerifiedOutlined } from '@ant-design/icons';
import Input from '../../components/Input'
import encrypt from '../../tools/AES'
import { message } from 'antd';
import ajax from '../../tools/ajax';
import useKey from './useKey';
export default function Forget(props) {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')
    const [accountPW, setAccountPW] = useState('')
    const [isForbid, setForbid] = useState(true)
    const key = useKey('')
    const submit = function(){
        const data = {
            username: account,
            password: encrypt(password,key.current),
            accountPW: encrypt(accountPW,key.current)
        }
        ajax('POST', '/rl/reset', data).then((response) => {
            if(response.data.code === 0){
                setPassword('')
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
                forbid = e.target.value && password && accountPW
                setAccount(e.target.value)
                break;
            }
            case 'password':{
                forbid = e.target.value  && account  && accountPW
                setPassword(e.target.value)
                break;
            }
            case 'accountPW': {
                forbid = e.target.value && password  && account
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
            <h2>密码更改</h2>
            <div className='msg-form'>
                <Input icon={<UserOutlined/>} input={{
                    placeholder:'学号',
                    onChange:function(e){
                        inputHandler('account', e)
                    }
                }} />
                <Input icon={<VerifiedOutlined/>} input={{
                    placeholder:'请输入学号密码',
                    type:'password',
                    value: password,
                    onChange:function(e){
                        inputHandler('password', e)
                    }
                }} />
                <Input icon={<VerifiedOutlined/>} input={{
                    placeholder:'请输入账户密码',
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
