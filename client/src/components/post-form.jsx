import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../features/posts/post-slice";
import TimeAndDatePicker from "./date-and-time-picker";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function PostForm() {
  const [text, setText] = useState("");
  const [isScheduled, setSchedule] = useState(false);
  const [scheduledAt, setScheduledAt]=useState(0);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleSchedule = (scheduledValue) => {
    setScheduledAt(scheduledValue)
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const formData = new FormData();
    formData.append('text', text);
    formData.append('published', !isScheduled);
    formData.append('platforms', user?.access_tokens);
    if (isScheduled) {
      formData.append('scheduledAfter', scheduledAt);
    }
    if (file) {
      formData.append('file', file);
    }
    await dispatch(createPost(formData));

    setScheduledAt(0);
    setText("");
    setFile(null);
    setSchedule(false);
  };

  return (
    <section className="form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div style={{display:"flex", flexDirection:"row"}}>
            <label htmlFor="text">Posts</label>
            <input
              type="text"
              name="text"
              id="text"
              value={text}
              placeholder="Make a Post"
              onChange={(e) => setText(e.target.value)}
            />
            <input type="file" name="file"  onChange={handleFileChange} />
          </div>
          <div style={{
              display: "flex",
              flexDirection:'row',
              justifyContent: "space-between",
            }}>
            <FormControlLabel
              value={isScheduled}
              control={<Switch color="primary" />}
              label="Schedule Post"
              labelPlacement="start"
              onClick={() => setSchedule(!isScheduled)}
            />
            {isScheduled && <TimeAndDatePicker setScheduleValueHandler={(selectedValue) => handleSchedule(selectedValue)} />}
          </div>
          <button type="submit" className="btn btn-block">
            Submit Post
          </button>
        </div>
      </form>
    </section>
  );
}

export default PostForm;
