import { Route, Routes, Navigate } from 'react-router-dom'
import React from 'react'

// 引入页面
import Issues from '../pages/Issues'
import Books from '../pages/Books'
import BookDetail from '../pages/BookDetail.jsx'
import Interviews from '../pages/Interviews'
import AddIssue from '../pages/AddIssue'
import IssueDetail from '../pages/IssueDetail'
import SearchPage from '../pages/SearchPage'
import Personal from '../pages/Personal'
import NotFound from '../pages/NotFound.jsx'

function RouteConfig () {
  return (
    <Routes>
      <Route path="/issues" element={<Issues />} />
      <Route path="/issues/:id" element={<IssueDetail />} />
      {/* <Route path="/books" element={<Books />} /> */}
      <Route path="/books" Component={Books} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/addIssue" element={<AddIssue />} />
      <Route path="/interviews" element={<Interviews />} />
      <Route path="/searchPage" element={<SearchPage />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/" element={<Navigate replace to="/issues" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RouteConfig
