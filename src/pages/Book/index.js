import React, { useEffect, useState, Suspense, lazy, memo } from 'react'
import { Layout, Menu } from 'antd';
import { LaptopOutlined, BookOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, Route, Switch, Redirect} from 'react-router-dom'
import Loading from '../../components/Loading'
import './index.css'
import useCategory from '../../Hooks/useCategory/useCategory';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const All = lazy(()=> import('./All'))
const Category = lazy( () => import('./Category'))
const Bookinfo = lazy(()=> import('./Bookinfo'))
const Search = lazy(()=>import('./Search'))
export default memo(function Book(props) {
    const [slideLoading, setSlideLoading] = useState(true)
    const category = useCategory()
    let defaultKey = 'book'
    let defaultOpen = false
    if(props.location.search) {
        let search = props.location.search
        defaultKey = search.split('=')[1]
        defaultOpen = true
    } else {
        let pathname = props.location.pathname
        defaultKey = pathname.match('search') ? 'search' : 'book'
    }
    useEffect(() => {
        if(category.length) {
            setSlideLoading(false)
        }
    },[category])
    return (
        <Layout className='book-wrap'>
            <Sider width={200} className="site-layout-background">
                {
                    slideLoading ? <Loading /> : 
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[defaultKey]}
                        defaultOpenKeys={ defaultOpen ? ['sub1'] : []}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                    <Menu.Item key="book" icon={<BookOutlined />}>
                        <Link to='/home/book/all'>全部</Link> 
                    </Menu.Item>
                    <Menu.Item key="search" icon={<SearchOutlined />}>
                        <Link to='/home/book/search'>搜索</Link> 
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<LaptopOutlined />} title="分类">
                        {
                            category.map((item) => (
                                <Menu.Item key={item.Code}>
                                    <Link to={`/home/book/category?code=${item.Code}`}>
                                        {item.Name}
                                    </Link>
                                </Menu.Item>
                            ))
                        }
                    </SubMenu>
                </Menu>
                }
            </Sider>
            <Content
                className="site-layout-background"
                style={{
                    padding: '20px 24px 0',
                    margin: 0,
                    minHeight: 280,
                }}
            >
                <Suspense fallback={<Loading/>}>
                    <Switch>
                        <Route path='/home/book/all' component={All}></Route>
                        {/* search传参 */}
                        <Route path='/home/book/category' component={Category}></Route>
                        <Route path='/home/book/search' component={Search}></Route>
                        <Route path='/home/book/:ISBN' component={Bookinfo}></Route>
                        <Redirect to='/home/book/all'/>
                    </Switch>
                </Suspense>
            </Content>
        </Layout>
    )
    
})
