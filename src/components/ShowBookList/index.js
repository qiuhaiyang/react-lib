import React,{Fragment, memo} from 'react'
import {Link} from 'react-router-dom'
import { SERVERHOST } from '../../tools/constant'
import Loading from '../Loading'
import './index.css'
export default memo(function ShowBookList(props) {
    return (
        <Fragment>
            {
                props.load ? 
                <div className='load-wrap'>
                    <Loading /> 
                </div>
                 :
                 <Fragment>
                    {
                        props.datalist.length === 0 ? 
                        <div className='no-data'>
                            <span>no data</span>
                        </div> :
                        <ul className='list-wrap'>
                        {
                            props.datalist.map((item) => (
                                <Link to={`/home/book/${item.ISBN}`} key={item.ISBN} className='list-item-wrap'>
                                    <img src={SERVERHOST + item.PicSrc.slice(1)} alt={item.BookName} className='book-img'/>
                                    <span className='book-title'>{item.BookName}</span>
                                </Link>
                            ))
                        }
                        </ul>
                    }
                 </Fragment>
            }
        </Fragment>
    )
})
