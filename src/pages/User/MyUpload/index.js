import React, { useState, useEffect} from 'react'
import ajax from '../../../tools/ajax'
import Loading from '../../../components/Loading'
import { Table, message, Popconfirm } from 'antd';
export default function MyUpload() {
    const [loading, setLoading] = useState(true),
          [data, setData] = useState()
    useEffect(() => {
        ajax("GET",'/user/myupload').then((response) => {
            if(response.data.code === 2) {
                let {data} = response.data
                data.map((item) => {
                    item.key = item.BookHash
                    return item
                })
                setData(data)
                setLoading(false)
            } else {
                message.warning('你没有上传相关书籍，如果你上传过，请与工作人员联系!!')
                setData([])
                setLoading(false)
            }
        })
    },[])
    const columns = [
        {
            title: '书名',
            dataIndex: 'BookName',
            key: 'BookName'
        },
        {
            title: 'ISBN',
            dataIndex: 'ISBN',
            key: 'ISBN'
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
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to delete this book?"
                    onConfirm={() => {deleteBook(record.BookHash)}}
                    onCancel={(e) => {}}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="#">删除</a>
                </Popconfirm>
            )
        },
    ]
    const deleteBook = (bookhash) => {
        setLoading(true)
        ajax('POST',`/book/delete/${bookhash}`).then((response) => {
            if(response.data.code === 2) {
                let newData = []
                for(let i = 0;i < data.length; i ++) {
                    if(data[i].BookHash !== bookhash) {
                        newData.push(data[i])
                    }
                }
                message.success('成功了')
                setData(newData)
                setLoading(false)
            }else {
                setLoading(false)
                message.error(response.data.msg)
            }
        })
    }
    return (
        <>
            {
                loading ? <Loading /> : 
                <div style={{width:'100%',height:'100%'}}>
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
                    />
                </div>
            }
        </>
    )
}
