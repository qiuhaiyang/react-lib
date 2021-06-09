import axios from "axios";
import qs from 'qs';
import { SERVERHOST } from "./constant";
export default function ajax(method = 'GET', url = '/', data = {}, head = {}, form=false){
    return new Promise((resolve, reject) => {
        let header = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        for(let prop in head){
            header[prop] = head[prop]
        }
        let authorization = sessionStorage.getItem('authorization')
        if(authorization) {
            header['authorization'] = authorization
        }
        if(!form) {
            data = qs.stringify(data)
        }
        axios({
            method,
            baseURL: SERVERHOST,
            url,
            headers: header,//请求头
            timeout:10000,//超时设置
            responseType: 'json',
            data:data
        }).then((response) => {
            resolve(response)
        }).catch((err) => {
            reject(err)
        })
    })
}