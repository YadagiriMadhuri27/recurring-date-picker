"use client";
import React, { useState, useEffect } from 'react';
import './RecurrentDatePicker.css';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const RecurrentDatePicker = () => {
  const [frequency, setFrequency] = useState('daily');
  const [interval, setInterval] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weekDays, setWeekDays] = useState([]);
  const [monthlyPattern, setMonthlyPattern] = useState({ occurrence: 'first', day: 'Monday' });
  const [previewDates, setPreviewDates] = useState([]);

  const handleWeekDayToggle = (day) => {
    setWeekDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const getRecurringDates = () => {
    const result = [];
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start);
    
    // If no end date, generate for 1 year ahead
    if (!endDate) {
      end.setFullYear(end.getFullYear() + 1);
    }

    let current = new Date(start);

    while (current <= end && result.length < 100) {
      switch (frequency) {
        case 'daily':
          result.push(new Date(current));
          current.setDate(current.getDate() + parseInt(interval));
          break;

        case 'weekly':
          if (weekDays.includes(weekdays[current.getDay()])) {
            result.push(new Date(current));
          }
          current.setDate(current.getDate() + 1);
          break;

        case 'monthly':
          const temp = new Date(current);
          temp.setDate(1);
          const targetDay = weekdays.indexOf(monthlyPattern.day);
          let count = 0;

          for (let d = 1; d <= 31; d++) {
            temp.setDate(d);
            if (temp.getDay() === targetDay) {
              count++;
              if (count === getOccurrenceIndex(monthlyPattern.occurrence)) {
                break;
              }
            }
          }

          if (!isNaN(temp.getTime()) && temp >= start && temp <= end) {
            result.push(new Date(temp));
          }

          current.setMonth(current.getMonth() + parseInt(interval));
          break;

        case 'yearly':
          result.push(new Date(current));
          current.setFullYear(current.getFullYear() + parseInt(interval));
          break;

        default:
          break;
      }
    }

    return result;
  };

  const getOccurrenceIndex = (occurrence) => {
    switch (occurrence) {
      case 'first': return 1;
      case 'second': return 2;
      case 'third': return 3;
      case 'fourth': return 4;
      default: return 1;
    }
  };

  useEffect(() => {
    if (startDate) {
      setPreviewDates(getRecurringDates());
    }
  }, [frequency, interval, startDate, endDate, weekDays, monthlyPattern]);

  return (
    <div className="recurring-container">
      <h2>Recurring Date Picker</h2>

      <label>Frequency:</label>
      <select value={frequency} onChange={e => setFrequency(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <label>Every:</label>
      <input type="number" value={interval} onChange={e => setInterval(e.target.value)} min="1" />

      {frequency === 'weekly' && (
        <div>
          <label>Select Days:</label>
          {weekdays.map(day => (
            <label key={day}>
              <input type="checkbox" checked={weekDays.includes(day)} onChange={() => handleWeekDayToggle(day)} />
              {day}
            </label>
          ))}
        </div>
      )}

      {frequency === 'monthly' && (
        <div>
          <label>Pattern:</label>
          <select value={monthlyPattern.occurrence} onChange={e => setMonthlyPattern(p => ({ ...p, occurrence: e.target.value }))}>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
            <option value="fourth">Fourth</option>
          </select>
          <select value={monthlyPattern.day} onChange={e => setMonthlyPattern(p => ({ ...p, day: e.target.value }))}>
            {weekdays.map(day => <option key={day}>{day}</option>)}
          </select>
        </div>
      )}

      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

      <label>End Date (optional):</label>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

      <div className="calendar-preview">
        <h3>Calendar Preview</h3>
        <ul>
          {previewDates.map((date, i) => (
            <li key={i}>{date.toDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecurrentDatePicker;
