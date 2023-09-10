import React from 'react'
/**
 * 放置一些工具函数
 */

/**
 * 格式化时间戳
 * @param {*} timestamp
 * @returns
 */
export function formatDate (timestamp, part) {
  if (!timestamp) {
    return
  }
  const date = new Date(parseInt(timestamp))

  const year = date.getFullYear() // 年
  let month = date.getMonth() + 1 // 月
  let day = date.getDate() // 日

  let hour = date.getHours() // 时
  let minutes = date.getMinutes() // 分
  let seconds = date.getSeconds() // 秒

  const weekArr = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  const week = weekArr[date.getDay()]

  // 需要给一位数前面加 0
  // 9 点 ----> 09:45:03

  if (month >= 1 && month <= 9) {
    // month += '0'; // a += b ----> a = a + b
    month = '0' + month
  }

  if (day >= 0 && day <= 9) {
    day = '0' + day
  }

  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }

  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }

  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }

  let str = ''

  switch (part) {
    case 'year': {
      str = `${year}-${month}-${day}`
      break
    }
    case 'time': {
      str = `${hour}:${minutes}:${seconds} `
      break
    }
    case 'year-time': {
      str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
      break
    }
    case 'time-week': {
      str = `${hour}:${minutes}:${seconds} ${week}`
      break
    }
    default: {
      str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`
    }
  }

  return str
}

/**
 * 批量生成下拉列表
 */

export function typeOptionCreator (Select, typeList) {
  const optionContainer = []
  for (let i = 0; i < typeList.length; i++) {
    optionContainer.push(
      <Select.Option
        value={typeList[i]._id}
        key={typeList[i]._id}
      >
        {typeList[i].typeName}
      </Select.Option>
    )
  }
  return optionContainer
}
