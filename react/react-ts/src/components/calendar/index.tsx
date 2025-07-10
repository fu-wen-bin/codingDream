import './index.scss';
import MonthCalendar from './MonthCalendar';
import Header from './Header';
import { Dayjs } from 'dayjs';

export interface CalendarProps {
  value: Dayjs
}

function Calendar(props: CalendarProps) {  // { value: Dayjs }
  return (
    <div className="calendar">
      <Header />
      <MonthCalendar {...props}/>
    </div>
  );
}

export default Calendar;