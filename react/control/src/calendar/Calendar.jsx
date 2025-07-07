import './Calendar.css'
import { useState } from 'react'

function Calendar (props) {
  const { defaultValue, onChange } = props

  const [date, setDate] = useState(defaultValue)
  const [selectedDate, setSelectedDate] = useState(defaultValue.getDate())

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  const renderDates = () => {
    const days = []

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth())

    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth())

    const clickHandle = (day) => {
      setSelectedDate(day)
    }

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>)
    }
    for (let i = 1; i <= daysCount; i++) {
      const isSelected = i === selectedDate
      days.push(<div key={i}
                     className={`day ${isSelected ? 'selected' : ''}`}
                     onClick={() => {clickHandle(i)}}>{i}</div>)
    }
    return days
  }

  const daysOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const firstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>{date.getFullYear()} 年 {date.getMonth() + 1}月</div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="Day">日</div>
        <div className="Day">一</div>
        <div className="Day">二</div>
        <div className="Day">三</div>
        <div className="Day">四</div>
        <div className="Day">五</div>
        <div className="Day">六</div>
        {
          renderDates()
        }
      </div>

    </div>
  )
}

export default Calendar