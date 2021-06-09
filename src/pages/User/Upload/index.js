import React, { useState} from 'react'
import useCategory from '../../../Hooks/useCategory/useCategory'
import ajax from '../../../tools/ajax';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    message,
    Button
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
export default function UploadData() {
    const [inputdata, setInputData] = useState({
        ISBN:null,
        BookName:null,
        Author:null,
        Publisher:null,
        Description:null,
        Category:null,
        PubDate:null,
        img:null
    }),
          category = useCategory(),
          [loading, setLoading] = useState(false),
          [imageUrl, setImageUrl] = useState(),
          [uploading, setUploading] = useState(false)
    const validateMessages = {
        required: '${label} is required!'
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true)
          return;
        }
        if (info.file.status === 'done') {
            let obj = {...inputdata}
            obj.img = info.file.originFileObj
            setLoading(false)
            setInputData(obj)
            setImageUrl(URL.createObjectURL(info.file.originFileObj))
        }
    };
    const uploadData = info => {
        info.onProgress(info.file)
        info.onSuccess()
    }
    const changeHandle = (e, type) => {
        let obj = {...inputdata}
        obj[type] = e.target.value
        setInputData(obj)
    }
    const dateChange = (date) => {
        let obj = {...inputdata}
        let dateString = `${date._d.getFullYear()}-${date._d.getMonth() + 1}-${date._d.getDate()}` 
        obj.PubDate = dateString
        setInputData(obj)
    }
    const finish = () => {
        const formData = new FormData()
        Object.entries(inputdata).map((item) => {
            if(item[1]) {
                formData.append(item[0],item[1])
            } else {
                formData.append(item[0],'')
            }
            return item
        })
        setUploading(true)
        ajax("POST",'/book/upload',formData,{ 'Content-Type': 'multipart/form-data' },true).then((response)=>{
            setUploading(false)
            if(response.data.code === 2) {
                message.success('修改成功')
            } else {
                message.error('修改失败')
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <>
            <Form
                labelCol={{
                span: 4,
                }}
                wrapperCol={{
                span: 14,
                }}
                layout="horizontal"
                validateMessages={validateMessages}
                onFinish={finish}
            >
                <Form.Item label="书名" rules={[{ required: true }]} name={['BookName']}>
                    <Input  onChange={(e) => {changeHandle(e, 'BookName')}}/>
                </Form.Item>
                <Form.Item label="ISBN" rules={[{ required: true }]} name={['ISBN']}>
                    <Input  onChange={(e) => {changeHandle(e, 'ISBN')}}/>
                </Form.Item>
                <Form.Item label="作者" rules={[{ required: true }]} name={['Author']}>
                    <Input  onChange={(e) => {changeHandle(e, 'Author')}}/>
                </Form.Item>
                <Form.Item label="出版社" rules={[{ required: true }]} name={['Publisher']}>
                    <Input  onChange={(e) => {changeHandle(e, 'Publisher')}}/>
                </Form.Item>
                <Form.Item label="出版时间" rules={[{ required: true }]} name={['PubDate']}>
                    <DatePicker onChange={dateChange}/>
                </Form.Item>
                <Form.Item label="描述">
                    <Input.TextArea 
                        placeholder="关于书本的介绍"
                        onChange={(e) => {changeHandle(e, 'Description')}}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>
                <Form.Item label="图书类别" rules={[{ required: true }]} name={['Category']}>
                    <Select onChange={(val) => {
                        let obj = {...inputdata}
                        obj.Category = val
                        setInputData(obj)
                    }}>
                        {
                            category.map((item) => (
                                <Select.Option key={item.Code} value={item.Code}>{item.Name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="图片">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={uploadData}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        accept='.jpeg,.jpg,.png'
                    >
                        {imageUrl ? <img alt='pic' src={imageUrl} alt="picture" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 16, offset: 8 }} style={{marginTop:-20}}>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
