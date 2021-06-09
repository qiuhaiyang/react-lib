import React, { useEffect, useState, Fragment } from 'react'
import { Pagination, message } from 'antd';
import ShowBookList from '../../../components/ShowBookList'
import ajax from '../../../tools/ajax'
import Loading from '../../../components/Loading'
import qs from 'qs'
import './index.css'
export default function Category(props) {
    const obj = qs.parse(props.location.search.slice(1))
    const [data, setData] = useState([])
    const [num, setNum] = useState(0)
    const [loading, setLoading] = useState(true)
    const [dataLoad, setDataLoad] = useState(false)
    useEffect(()=>{
        setLoading(true)
        let numIsload = false, dataIsLoad = false
        ajax('GET', `/book/category/${obj.code}/1`).then((response) => {
            numIsload ? setLoading(false) : (dataIsLoad = true)
            console.log(response)
            if(response.data.code === 2) {
                setData(response.data.data)
            }else {
                message.error(response.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
        })
        ajax('GET', `/book/categoryNum/${obj.code}`).then((response) => {
            setNum(response.data.data[0].num)
            dataIsLoad ? setLoading(false) : (numIsload = true)
        }).catch((err) => {
            console.log(err)
        })
    },[obj.code])
    const changePages = (page) => {
        setDataLoad(true)
        ajax('GET', `/book/category/${obj.code}/${page}`).then((response) => {
            setDataLoad(false)
            if(response.data.code === 2) {
                setData(response.data.data)
            }else {
                message.error(response.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    return (
        <Fragment>
            {
                loading ? <Loading /> :
                <div className='book-list-wrap'>
                    <ShowBookList datalist={data} load={dataLoad} />
                    <Pagination 
                        defaultCurrent={1} 
                        total={num}
                        showSizeChanger={false}
                        onChange={changePages}
                    />
                </div>
            }
            
        </Fragment>
    )
}
