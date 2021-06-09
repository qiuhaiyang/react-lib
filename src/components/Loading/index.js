import React from 'react'
import { Spin, Space } from 'antd';
import './index.css'
export default function index() {
    return (
        <div className='load-wrap'>
            <Space size="middle">
                <Spin size="large" />
            </Space>
        </div>
    )
}
