import React, { Suspense, lazy, useContext } from 'react'
import { Layout, Menu, Badge } from 'antd';
import { UserOutlined, LayoutOutlined, UploadOutlined, IdcardOutlined, MessageOutlined } from '@ant-design/icons';
import { Link, Route, Switch, Redirect} from 'react-router-dom'
import Loading from '../../components/Loading'
import './index.css'
import { Context } from '../../tools/constant';
const { Content, Sider } = Layout;
const UserInfo = lazy(()=>import('./UserInfo'))
const BorrowInfo = lazy(()=>import('./BorrowInfo'))
const Upload = lazy(()=>import('./Upload'))
const MyUpload = lazy(()=>import('./MyUpload'))
const Message = lazy(()=>import('./Message'))
export default function User(props) {
    const msg = useContext(Context)
    const handleClick = function() {
        msg.setMsg({newDataNum:0,data:[...msg.msg.data]})
    }
    return (
        <Layout className='user-wrap'>
            <Sider width={200} className="site-layout-background">
                <Menu
                mode="inline"
                defaultSelectedKeys={[props.location.pathname.split('/').pop()]}
                style={{ height: '100%', borderRight: 0 }}
                >
                <Menu.Item key="info" icon={<UserOutlined />}>
                        <Link to='/home/user/info'>个人信息</Link> 
                </Menu.Item>
                <Menu.Item key="borrow" icon={<IdcardOutlined />}>
                        <Link to='/home/user/borrow'>个人借阅信息</Link> 
                </Menu.Item>
                <Menu.Item key="bookupload" icon={<UploadOutlined />}>
                        <Link to='/home/user/bookupload'>书本上传</Link> 
                </Menu.Item>
                <Menu.Item key="myupload" icon={<LayoutOutlined />}>
                        <Link to='/home/user/myupload'>我上传的书</Link> 
                </Menu.Item>
                <Menu.Item key="message" icon={<MessageOutlined />} onClick={ handleClick }>
                    <Badge count={msg.msg.newDataNum} offset={[20,5]}>
                        <Link to='/home/user/message'>我的消息</Link> 
                    </Badge>
                </Menu.Item>
                </Menu>
            </Sider>
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                <Suspense fallback={<Loading/>}>
                    <Switch>
                        <Route path='/home/user/info' component={UserInfo}></Route>
                        <Route path='/home/user/borrow' component={BorrowInfo}></Route>
                        <Route path='/home/user/bookupload' component={Upload}></Route>
                        <Route path='/home/user/myupload' component={MyUpload}></Route>
                        <Route path='/home/user/message' component={Message}></Route>
                        <Redirect to='/home/user/info'/>
                    </Switch>
                </Suspense>
            </Content>
      </Layout>
    )
}
