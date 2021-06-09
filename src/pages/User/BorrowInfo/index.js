import React, {useEffect, useState} from 'react'
import ajax from '../../../tools/ajax'
import { message, Table, Space } from 'antd';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading'
const columns = [
    {
        title: '标题',
        dataIndex: 'bookName',
        key: 'bookName'
    },
    {
        title: 'ISBN',
        dataIndex: 'ISBN',
        key: 'ISBN'
    },
    {
        title: '出借人',
        dataIndex: 'borrower',
        key: 'borrower'
    },
    {
        title: '交易时间',
        dataIndex: 'time',
        key: 'time',
        render: (text,record) => (
            <span>{new Date(parseInt(record.time)).toDateString()}</span>
        )
    },
    {
        title: '有效保护截止时间',
        dataIndex: 'timeOfDuration',
        key: 'timeOfDuration',
        render: (text,record) => (
            <span>{new Date(parseInt(record.timeOfDuration) * 2678400000 + parseInt(record.time)).toDateString()}</span>
        )
    },
    {
        title: 'Action',
        key: 'action',
        render:(text, record) => (
            <Space size="middle">
                <Link to={`/home/book/${record.ISBN}`}> 书本详情 </Link>
            </Space>
        )
    }
]
export default function BorrowInfo() {
    const [data, setData] = useState(),
          [loading, setLoading] = useState(true)
    useEffect(() => {
        console.log(1)
        ajax('GET','/user/order').then((response) => {
            if(response.data.code === 2){
                response.data.data.map((item) => {
                    return item.key = item.bookHash
                })
                setData(response.data.data)
            } else {
                message.error('error')
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    },[])
    return (
            <>
                {
                    loading ? <Loading /> : 
                    <div className='search-result'>
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            pagination={{
                                total:data.length,
                                pageSize:data.length ,
                                showSizeChanger:false,
                                disabled:true,
                                hideOnSinglePage:true
                            }}
                            className='tables'
                        />
                    </div>
                }
            </>
    )
}
