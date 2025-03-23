import React, { useState } from 'react';
import { ArrowUpDown, MapPin, Calendar } from 'lucide-react';

// Note: In a real implementation, you would install and import a proper date picker library
// This is a simplified version to demonstrate the concept
const SimpleDatePicker = ({ selectedDate, onChange, onClose } : {
    selectedDate: Date,
    onChange: (date: Date) => void,
    onClose: () => void
})  => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  
  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isSelected = 
        date.getDate() === selectedDate.getDate() && 
        date.getMonth() === selectedDate.getMonth() && 
        date.getFullYear() === selectedDate.getFullYear();
      
      const isToday = 
        date.getDate() === new Date().getDate() && 
        date.getMonth() === new Date().getMonth() && 
        date.getFullYear() === new Date().getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`}
          onClick={() => {
            onChange(date);
            onClose();
          }}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-colors
            ${isSelected ? 'bg-blue-500 text-white font-semibold' : ''}
            ${!isSelected && isToday ? 'border border-blue-500 text-blue-500 font-semibold' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
          `}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border">
      {/* Header with month/year navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
        >
          &lt;
        </button>
        <div className="font-semibold text-gray-800">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </div>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
        >
          &gt;
        </button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm text-gray-500 font-medium">{day}</div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      {/* Quick select options */}
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={() => {
            const today = new Date();
            onChange(today);
            onClose();
          }}
          className="flex-1 py-2 text-blue-500 hover:bg-blue-50 rounded font-medium text-sm"
        >
          Today
        </button>
        <button 
          onClick={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            onChange(tomorrow);
            onClose();
          }}
          className="flex-1 py-2 text-blue-500 hover:bg-blue-50 rounded font-medium text-sm"
        >
          Tomorrow
        </button>
      </div>
    </div>
  );
};

const DestSearchForm = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 22)); // March 22, 2025
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  
  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  
  const formatDate = (date : Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };
  
  const tomorrow = new Date(2025, 2, 23);
  const dayAfter = new Date(2025, 2, 24);
  
  return (
    <div className="flex justify-center absolute  -top-36 left-4 md:justify-start md:w-[90%] w-full items-center min-h-screen p-4">
      <div className="bg-white p-6 w-full md:max-w-md rounded-3xl">
        <h1 className="sm:text-3xl text-xl font-bold text-gray-800 mb-1">Bus Ticket Booking</h1>
        <p className="text-gray-600 lg:text-lg text-sm mb-6">Online Bus Booking made easy with bustify</p>
        
        <div className="mb-4 relative">
          <div className="border rounded-lg p-4 mb-4 flex items-center">
            <div className="mr-2 text-gray-500">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
            <input 
              type="text" 
              placeholder="Leaving From" 
              className="w-full outline-none text-gray-700"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
            />
          </div>
          
          <div className="absolute  transform -translate-y-1/2 w-px h-16 bg-gray-300 z-0"></div>
          
          <div 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
            onClick={swapLocations}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ArrowUpDown className="text-gray-600" />
            </div>
          </div>
          
          <div className="border rounded-lg p-4 flex items-center">
            <div className="mr-2 text-gray-500">
              <MapPin size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Going To" 
              className="w-full outline-none text-gray-700"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-4 relative">
          <div 
            className="border rounded-lg p-4 cursor-pointer"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <span>Departure</span>
              <Calendar size={16} className="ml-2" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold lg:text-lg text-sm">{formatDate(selectedDate)}</div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedDate.getDate() === tomorrow.getDate() && 
                    selectedDate.getMonth() === tomorrow.getMonth() 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(tomorrow);
                  }}
                >
                  Today
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedDate.getDate() === dayAfter.getDate() && 
                    selectedDate.getMonth() === dayAfter.getMonth() 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(dayAfter);
                  }}
                >
                  Tomorrow
                </button>
              </div>
            </div>
          </div>
          
          {showCalendar && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20">
              <SimpleDatePicker 
                selectedDate={selectedDate} 
                onChange={setSelectedDate} 
                onClose={() => setShowCalendar(false)}
              />
            </div>
          )}
        </div>
        
        <button className="w-full bg-blue-900 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors">
          Search Buses
        </button>
      </div>
    </div>
  );
};

export default DestSearchForm;