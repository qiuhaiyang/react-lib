import React, { useEffect, useState, Fragment } from 'react'
import { Pagination, message } from 'antd';
import ShowBookList from '../../../components/ShowBookList'
import ajax from '../../../tools/ajax'
import Loading from '../../../components/Loading'
import './index.css'
export default function All(props) {
    const [data, setData] = useState([])
    const [num, setNum] = useState(0)
    const [loading, setLoading] = useState(true)
    const [dataLoad, setDataLoad] = useState(false)
    useEffect(()=>{
        let numIsload = false, dataIsLoad = false
        ajax('GET', `/book/all/1`).then((response) => {
            if(response.data.code === 2) {
                setData(response.data.data)
                numIsload ? setLoading(false) : (dataIsLoad = true)
            }else {
                message.error(response.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
        })
        ajax('GET', '/book/allnum').then((response) => {
            setNum(response.data.data[0].num)
            dataIsLoad ? setLoading(false) : (numIsload = true)
        }).catch((err) => {
            console.log(err)
        })
    },[])
    const changePages = (page) => {
        setDataLoad(true)
        ajax('GET', `/book/all/${page}`).then((response) => {
            if(response.data.code === 2) {
                setDataLoad(false)
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
                    <ShowBookList datalist={data} load={dataLoad}/>
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
