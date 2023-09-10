import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Pagination } from 'antd'

import PageHeader from '../components/PageHeader'
import IssueItem from '../components/IssueItem'
import { getIssueByPage } from '../api/issue'
import AddIssueBtn from '../components/AddIssueBtn'
import Recommend from '../components/Recommend'
import ScoreRank from '../components/ScoreRank'
import styles from '../css/Issue.module.css'
import TypeSelect from '../components/TypeSelect'

function Issues (props) {
  // 问答列表数据
  const [issueInfo, setIssueInfo] = useState([])

  // 分页信息
  const [pageInfo, setPageInfo] = useState({
    current: 1, // 当前是第一页
    pageSize: 15, // 每一页显示 15 条数据
    total: 0 // 数据的总条数
  })

  // 从状态仓库获取当前是否有 typeId 的值
  const { issueTypeId } = useSelector(state => state.type)

  /**
     * 分页器
     */
  function handlePageChange (current, pageSize) {
    setPageInfo({
      current,
      pageSize
    })
  }

  useEffect(() => {
    async function fetchData () {
      const searchParams = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        issueStatus: true
      }
      if (issueTypeId !== 'all') {
        // 用户点击了分类的，那么就需要根据分类来渲染
        searchParams.typeId = issueTypeId
        // 如果按照分类来进行查询，需要重新将当前页设置为第一页
        searchParams.current = 1
      }

      // {currentPage: 1, eachPage: 15, count: 21, totalPage: 2, data: Array(15)}
      const { data } = await getIssueByPage(searchParams)
      setIssueInfo(data.data)
      setPageInfo({
        current: data.currentPage,
        pageSize: data.eachPage,
        total: data.count
      })
    }
    fetchData()
  }, [pageInfo.current, pageInfo.pageSize, issueTypeId])

  // 问答列表
  const issueList = []
  for (let i = 0; i < issueInfo.length; i++) {
    issueList.push(<IssueItem key={i} issueInfo={issueInfo[i]} />)
  }

  return (
        <div className={styles.container}>
            {/* 上面的头部 */}
            <PageHeader title="问答列表">
                <TypeSelect />
            </PageHeader>
            {/* 下面的列表内容区域 */}
            <div className={styles.issueContainer}>
                {/* 左边区域 */}
                <div className={styles.leftSide}>
                    {issueList}
                    <div className="paginationContainer">
                        <Pagination
                            showQuickJumper
                            defaultCurrent={1}
                            {...pageInfo}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
                {/* 右边区域 */}
                <div className={styles.rightSide}>
                    <AddIssueBtn />
                    <div style={{
                      marginBottom: '30px'
                    }}><Recommend/></div>
                    <ScoreRank/>
                </div>
            </div>
        </div>
  )
}

export default Issues
