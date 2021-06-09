import React, {useEffect, useState} from 'react'
import ajax from '../../../tools/ajax'
import { Button, Upload, message } from 'antd';
import Loading from '../../../components/Loading'
import { SERVERHOST } from '../../../tools/constant';
import './index.css'
export default function UserInfo() {
    const [loading, setLoading] = useState(true)
    const [userdata, setUserdata] = useState({})
    const [edit, setEdit] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const [imgData, setImgData] = useState()
    const [modifyData, setModifydata] = useState({})
    useEffect(()=>{
        ajax('GET','/user').then((response) => {
            if(response.data.code === 2) {
                response.data.data.dateOfBirth = response.data.data.dateOfBirth.split('T')[0]
                response.data.data.lastLogin = response.data.data.lastLogin.split('.')[0].replace('T',' ')
                response.data.data.registeTiem = response.data.data.registeTiem.split('.')[0].replace('T',' ')
                setModifydata({
                    tel:response.data.data.tel,
                    email:response.data.data.email
                })
                setImgUrl(SERVERHOST + response.data.data.avatar.slice(1))
                delete response.data.data.avatar
                delete response.data.data.tel
                delete response.data.data.email
                setUserdata(response.data.data)
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
        })
    },[])
    useEffect(()=>{
        return () => {
            if(edit) {
                if(window.confirm("你的修改还未提交保存,是否保存?")) {
                    doSubmit()
                }
            }
        }
    },[])
    const transformField = {
        account: "账户",
        dateOfBirth: "出生日期",
        email: "邮箱",
        lastLogin: "上一次登录时间",
        name: "姓名",
        registeTiem: "注册时间",
        sex: "性别",
        tel: "电话",
        username: "学号"
    }
    const doImgUpload = (info) => {
        setImgData(info.file)
        setImgUrl(URL.createObjectURL(info.file))
    }   
    const doEdit = () => {
        setEdit(true)
    }
    const doSubmit = () => {
        if(!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(modifyData.email))) {
            message.error('邮箱格式不正确，请重填')
            return false; 
        }
        if(!(/^1[3456789]\d{9}$/.test(modifyData.tel))) { 
            message.error('手机号码有误，请重填')
            return false; 
        } 
        const formData = new FormData()
        if(imgData) {
            formData.append('img',imgData)
        }
        formData.append('tel',modifyData.tel)
        formData.append('email',modifyData.email)
        console.log(modifyData)
        ajax("POST",'/user/modify',formData,{ 'Content-Type': 'multipart/form-data' },true).then((response)=>{
            if(response.data.code === 2) {
                message.success('修改成功')
            } else {
                message.error('修改失败')
            }
            setEdit(false)
        })
    }
    const changeHandler = (e, type) => {
        let obj = {...modifyData}
        obj[type] = e.target.value
        console.log(obj)
        setModifydata(obj)
    } 
    return (
        <>
            {
                loading ? <Loading /> :
                <div className='userinfo-wrap'>
                    <div className='detail-info-wrap'>
                        {
                            Object.entries(userdata).map((item) => (
                                <p key={item[0]}>
                                    <label htmlFor={item[0]}>{transformField[item[0]]}：</label>
                                    <input 
                                        type='text'
                                        value={item[1]} 
                                        id={item[0]} 
                                        disabled={true}
                                    />
                                    <br/>
                                </p>
                            ))
                        }
                        {
                            Object.entries(modifyData).map((item)=>(
                                <p key={item[0]}>
                                    <label htmlFor={item[0]}>{transformField[item[0]]}：</label>
                                    <input 
                                        type={item[0]}
                                        value={item[1]}
                                        id={item[0]}
                                        disabled={!edit}
                                        className={edit ? 'active' : ''}
                                        onChange={(e) => {changeHandler(e, item[0])}}
                                    />
                                    <br/>
                                </p>
                            ))
                        }
                        <Button type='primary' onClick={doEdit} className='btn'>edit</Button>
                        <Button type='primary' onClick={doSubmit} className='btn'>submit</Button>
                    </div>
                    <div className='avatar-wrap'>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={doImgUpload }
                        accept='.jpeg,.jpg,.png'
                        disabled={!edit}
                    >
                        <img src={imgUrl} alt="avatar" style={{ width: '100%' }} />
                    </Upload>
                    </div>
                </div>
            }
        </>
    )
}
