import React, { useContext } from 'react'
import { Context } from '../../../tools/constant'
import './index.css'
export default function Message() {
    const data = useContext(Context).msg.data
    console.log('msg',data)
    return (
        <div className='msg-wraper'>
            {
                !data ? <></> :
                data.length === 0 ? <p className='msg-row-nodata'>no data</p> :
                data.map((item) => (
                    <p className='msg-row' key={item.random}>
                        {
                            item.type === '存书' ? '有人向你借 ' : '你向他人借的 '
                        }
                        <span>{item.bookName}</span>
                        {
                            item.type === '存书' ? ` 这本书，` : ' 这本书已经放在指定位置，'
                        }
                        你的<span>{item.type}</span>码为<span>{item.random}</span>
                    </p>
                ))
            }
        </div>
    )
}
