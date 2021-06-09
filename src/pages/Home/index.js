import React, {Fragment} from 'react'
import { Carousel } from 'antd';
import useWindowSize from '../../Hooks/useWindows/useWindowSize';
import './index.css'
export default function Home() {
    const clientHeight = useWindowSize()
    let height = clientHeight.height > 500 ? clientHeight.height : 500
    const styles = {
        width:'100%',
        height: (height - 102) + 'px',
        boxSizing:'border-box'
    }
    const sourceList = ['CNKI中国知网', '读秀学术搜索', '中国社会科学引文索引', '新东方多媒体学习库',
                        'WEB OF SCIENCE', 'EV Compendex', 'ACM', 'EBSCO']
    const more = () => false
    return (
        <Fragment>
            <Carousel autoplay  dots={false} >
                <div>
                    <img src='http://192.168.137.134:3000/public/images/2.jpg' alt='backgronud' style={styles}/>
                </div>
                <div>
                    <img src='http://192.168.137.134:3000/public/images/3.jpg' alt='backgronud' style={styles}/>
                </div>
                <div>
                    <img src='http://192.168.137.134:3000/public/images/4.jpg' alt='backgronud' style={styles}/>
                </div>
                <div>
                    <img src='http://192.168.137.134:3000/public/images/5.jpg' alt='backgronud' style={styles}/> 
                </div>
            </Carousel>
            <div className='source-wrap' style={{height:(clientHeight.height - 102) + 'px'}}>
                <div className='source-table'>
                    <h1 className='source-nav'>
                        <span>常用资源</span>
                        <a className='more' href='#' onClick={more}>{'更多 >>'}</a>
                    </h1>
                    <ul className='source-list'>
                        {
                            sourceList.map((item, index) => (
                                <a onClick={more} href='#' key={index}>
                                    <li>
                                        <img 
                                            src={`http://192.168.137.134:3000/public/images/zy${index + 1}-2.png`} 
                                            alt={`icon-${index}`}
                                            className='source-img'
                                        />
                                        <span>{item}</span>
                                    </li>
                                </a>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}
