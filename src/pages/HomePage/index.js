import React, { useState, useEffect , Fragment, lazy, Suspense} from 'react'
import ajax from '../../tools/ajax';
import { message , Button, Result, Badge } from 'antd';
import {FieldTimeOutlined ,SearchOutlined } from '@ant-design/icons';
import { Link, Route, Switch, Redirect} from 'react-router-dom';
import './index.css'
import Loading from '../../components/Loading'
import { Context, SOCKETHOST } from '../../tools/constant';
const Home = lazy(()=> import('../Home'))
const Book = lazy(() => import('../Book'))
const User = lazy(() => import('../User'))

export default function HomePage(props) {
    const [isLogin, setIsLogin] = useState(false),
          [account, setAccount] = useState(''),
          [msg, setMsg] = useState({data:[],newDataNum:0})
    const webSocket = (acc) => {
        if ("WebSocket" in window) {
            const ws = new WebSocket(SOCKETHOST);
            ws.onopen = function () {
                ws.send(acc)
            };

            ws.onmessage = function (evt) 
            { 
                var received_msg = evt.data;
                let obj = JSON.parse(received_msg)
                if(obj.type) {
                    message.info(`${obj.type === '存书' ? `你借的 ${obj.bookName} 这本书已放在指定位置` : 
                    `有人向您借 ${obj.bookName} 这本书`}，您的${obj.type}号码为${obj.random}`)
                    console.log(msg)
                    let newArr = [obj,...msg.data]
                    setMsg({
                        data: newArr,
                        newDataNum: newArr.length
                    })
                } else {
                    setMsg(obj)
                }
                console.log(obj)
            };
            
            ws.onclose = function()
            { 
                console.log('连接关闭！！！')
                ws.send('close')
            };
        } else {
            alert("您的浏览器不支持 WebSocket!");
        }
    }
    useEffect(()=>{
        ajax('GET', '/').then((response) => {
            if(response.status === 200 && response.data.code === 2){
                setIsLogin(true)
                webSocket(response.data.account)
                setAccount(response.data.account)
            }
        }).catch((err) => {
            if(err?.response?.status === 403){
                message.warning('你没有登录信息，或者你的登录信息已经过期，请重新登录！！！')
                setIsLogin(false)
            }
        })
    },[])
    return (
        <Fragment>
            {
                isLogin ? 
                <Context.Provider value={{msg, setMsg}}>
                    <div className='wrap'>
                        <header className='header-nav'>
                            <div className='logo'></div>
                            <div className='navs'>
                                <div className='tips'>
                                    <ul>
                                        <li><FieldTimeOutlined /> 开馆时间:8:00-22:00</li>
                                        <li><SearchOutlined /> 站内搜索</li>
                                        <li>网站地图</li>
                                    </ul>
                                </div>
                                <div className='router'>
                                    <Link className='link' to='/home/index'>主页</Link>
                                    <Link className='link' to='/home/book'>图书</Link>
                                    <Badge count={message.newDataNum} dot offset={[10,0]}>
                                        <Link className='link' to='/home/user'>账户:{account}</Link>
                                    </Badge>
                                </div>
                            </div>
                        </header>
                        <div className='content-wrap'>
                            <Suspense fallback={<Loading/>}>
                                <Switch>
                                    <Route path='/home/index' component={Home}/>
                                    <Route path='/home/book' component={Book}/>
                                    <Route path='/home/user' component={User}/>
                                    <Redirect to='/home/index'/>
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </Context.Provider> 
                : 
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" onClick={()=>{props.history.replace('/rl/login')}}>重新登录</Button>}
                />
            }
        </Fragment>
    )
}
