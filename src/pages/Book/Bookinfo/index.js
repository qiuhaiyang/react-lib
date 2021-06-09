import React, {useState, useEffect, Fragment} from 'react'
import { Image, Table, message, Popconfirm } from 'antd';
import ajax from '../../../tools/ajax';
import Loading from '../../../components/Loading'
import { SERVERHOST } from '../../../tools/constant';
import './index.css'
export default function Bookinfo(props) {
    const [loading, setLoading] = useState(true),
          [bookinfo, setBookinfo] = useState(),
          [txs, setTxs] = useState(),
          [transaction, setTransaction] = useState(false)
    useEffect(() => {
        ajax('GET',`/book/${props.match.params.ISBN}`).then((response) => {
            if(response.data.code === 2){
                let data = response.data.data
                setBookinfo(data.info)
                data.txs.map((item) => {
                    let duration = parseInt(item.timeOfDuration)
                    let borrowTime = new Date(parseInt(item.time))
                    let currentTime = new Date()
                    let diff = currentTime - borrowTime
                    item.key = item.bookHash
                    if(diff > 2678400000 * duration) {
                        item.overdue = true
                    } else {
                        item.overdue = false
                    }
                    item.overdueTime = 2678400000 * duration + borrowTime.getTime()
                    return item
                })
                setTxs(data.txs)
                setLoading(false)
            } else {
                message.error(response.data.msg)
                setTxs([])
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    },[props.match.params.ISBN])
    const columns = [
        {
            title: 'hash值',
            dataIndex: 'bookHash',
            key: 'bookHash'
        },
        {
            title: '出借人',
            dataIndex: 'borrower',
            key: 'borrower'
        },
        {
            title: '借书人',
            dataIndex: 'owner',
            key: 'owner'
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
                <span>{new Date(parseInt(record.overdueTime)).toDateString()}</span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to borrow this book?"
                    onConfirm={() => {borrow(record.bookHash)}}
                    onCancel={(e) => {}}
                    okText="Yes"
                    cancelText="No"
                    disabled={record.overdue}
                >
                    <a href="#" className={!record.overdue ? '' : 'disabled'}>借阅</a>
                </Popconfirm>
            )
        },
    ]
    const borrow = (bookhash) => {
        setTransaction(true)
        ajax('POST','/book/borrow',{bookHash:bookhash}).then((response) => {
            if(response.data.code === 2) {
                let newArr = []
                for(let i = 0;i < txs.length; i ++) {
                    if(txs[i].bookHash === bookhash) {
                        let obj = response.data.tx
                        let duration = parseInt(obj.timeOfDuration)
                        obj.key = txs[i].bookHash
                        obj.overdue = false
                        obj.overdueTime = 2678400000 * duration + parseInt(obj.time)
                        newArr.unshift(obj)
                    } else {
                        newArr.push(txs[i])
                    }
                }
                setTxs(newArr)
                message.success('成功了')
            }else {
                message.error(response.data.msg)
            }
            setTransaction(false)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <Fragment>
            {
                loading ? <Loading /> :
                <div className='book-wrap'>
                    {
                        txs.length === 0 ? <div className='book-error-wrap'><h2>no data</h2></div> :
                        <div className='book-info'>
                            <div className='book-detail'>
                                <Image src={SERVERHOST + bookinfo.PicSrc.slice(1)} className='book-img'/>
                                <div className='info'>
                                    <h2>{bookinfo.BookName}</h2>
                                    <p className='row2'>
                                        <span>ISBN: {bookinfo.ISBN}</span>
                                        <span>出版社: {bookinfo.Publisher}</span>
                                        <span>出版时间: {bookinfo.PubDate.split('T')[0]}</span>
                                    </p>
                                    <p>
                                        <span>作者: {bookinfo.Author}</span>
                                        <span>类别: {bookinfo.category}</span>
                                    </p>
                                </div>
                            </div>
                            <div className='description'>
                                <span>{bookinfo.Description}</span>
                            </div>
                        </div>
                    }
                    <div className='book-owners'>
                        <Table 
                            columns={columns} 
                            dataSource={txs} 
                            pagination={{
                                defaultCurrent:1, 
                                total:txs.length ,
                                showSizeChanger:false,
                                defaultPageSize:3
                            }}
                            className='tables'
                        />
                    </div>
                </div>
            }
            {
                transaction ? <div 
                    className='transaction-load-wrap'
                ><Loading/></div> : ''
            }
        </Fragment>
    )
}
