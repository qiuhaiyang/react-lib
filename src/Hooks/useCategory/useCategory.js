import { useEffect, useState} from 'react'
import { message } from 'antd';
import ajax from '../../tools/ajax'
export default function useCategory(){
    const [category, setCategory] = useState([]);
    useEffect(() => {
        ajax('GET', '/book/category').then((response) => {
            if(response.data.code === 2){
                let { data } = response.data
                setCategory(data)
            } else {
                message.info(response.data.msg)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }, []);
    return category;
}