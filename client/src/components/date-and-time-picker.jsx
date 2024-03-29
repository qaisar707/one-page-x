import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/en'; 
import { toast } from "react-toastify";


dayjs.extend(utc);
dayjs.extend(timezone);

const TimeAndDatePicker = ({ setScheduleValueHandler }) => {
  const [scheduledAt, setscheduledAt] = useState(null);

  const CustomDateTimePicker = styled(DateTimePicker)({
    paddingBottom: '10px',
  });

  const currentTime = dayjs();
  const minDateTime = currentTime.add(15, 'minute');
  const maxDateTime = currentTime.add(30, 'day');

  const handleChange = (value) => {
    const selectedDateTime = dayjs(value);

    if (selectedDateTime.isAfter(minDateTime)) {
      setscheduledAt(value);
      const unixTimestamp = selectedDateTime.unix();
      setScheduleValueHandler(unixTimestamp);
      return setScheduleValueHandler(unixTimestamp)
    }else{
      toast.error("Wrong Date Picked, Retry", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomDateTimePicker
        label="Select Date and Time"
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        timezone={dayjs.tz.guess()}
        value={scheduledAt}
        onAccept={(newValue) => handleChange(newValue)}
      />
    </LocalizationProvider>
  );
};

export default TimeAndDatePicker;
