import React, {useState} from 'react'
import { Input, Select, message, Table, Space } from 'antd';
import './index.css'
import { Link } from 'react-router-dom';
import ajax from '../../../tools/ajax'
const { Search } = Input;
const { Option } = Select;
export default function SearchUI() {
    const [filedsValue, setfiledsValue] = useState('BookName'),
          [searchValue, setSearchValue] = useState(''),
          [loading, setLoading] = useState(false),
          [num, setNum] = useState(0),
          [data, setData] = useState([])
    const columns = [
        {
            title: '标题',
            dataIndex: 'BookName',
            key: 'BookName'
        },
        {
            title: '作者',
            dataIndex: 'Author',
            key: 'Author'
        },
        {
            title: '出版社',
            dataIndex: 'Publisher',
            key: 'Publisher'
        },
        {
            title: '类别',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'Action',
            key: 'action',
            render:(text, record) => (
                <Space size="middle">
                    <Link to={`/home/book/${record.key}`}> 书本详情 </Link>
                </Space>
            )
        }
    ]
    const onSearch = () => {
        if(!searchValue) {
            message.warning('输入框不能为空，请重新输入!!!')
            return false
        }
        console.log(1)
        setLoading(true)
        let data = {
            fileds: filedsValue,
            search: searchValue,
            haveNum: false
        }
        ajax('POST', '/book/search', data).then((response) => {
            if(response.data.code === 2) {
                setData(response.data.data)
                setNum(response.data.num)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }
    const selectBefore = (
        <Select defaultValue="BookName" className="select-before" onChange={(val)=>{setfiledsValue(val)}}>
          <Option value="BookName">标题</Option>
          <Option value="Author">作者</Option>
        </Select>
    );
    const changePages = (page) => {
        setLoading(true)
        let data = {
            fileds: filedsValue,
            search: searchValue,
            haveNum: true,
            pages: page
        }
        ajax('POST', '/book/search', data).then((response) => {
            if(response.data.code === 2) {
                setData(response.data.data)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }
    return (
        <div className="search-wrap">
            <div className='search-ui'>
                <Search
                    addonBefore={selectBefore}
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    loading={loading}
                    onChange={(e)=>{setSearchValue(e.target.value)}}
                    onSearch={onSearch}
                />
            </div>
            <div className='search-result'>
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={{
                        defaultCurrent:1, 
                        total:num ,
                        showSizeChanger:false,
                        onChange:changePages
                    }}
                    className='tables'
                />
            </div>
        </div>
    )
}
