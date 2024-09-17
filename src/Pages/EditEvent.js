import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');

export default function EditEvent() {
  const [editCode, setEditCode] = useState('');
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    image: null,
    video: null,
    email: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('edit_code', editCode)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      alert('No event found with this code');
    } else if (data) {
      setEventData(data);
      setFormData({
        eventName: data.event_name,
        eventDate: data.event_date,
        email: data.email,
        phoneNumber: data.phone_number,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('events')
      .update({
        event_name: formData.eventName,
        event_date: formData.eventDate,
        image_url: formData.image ? 'NEW_IMAGE_URL' : eventData.image_url,
        video_url: formData.video ? 'NEW_VIDEO_URL' : eventData.video_url,
        email: formData.email,
        phone_number: formData.phoneNumber,
        updated_at: new Date().toISOString(), // Add this line to update the last update time
      })
      .eq('edit_code', editCode);

    if (error) {
      console.error('Error updating event:', error);
      alert(`Error: ${error.message}`);
    } else {
      console.log('Event updated successfully:', data);
      navigate('/success');  // Redirect to Success.js
    }
  };

  if (!eventData) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-5">Edit Event</h2>
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <input
            type="text"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            placeholder="Enter your edit code"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Edit Event</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
          placeholder="Event Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        {eventData.plan_id > 1 && (
          <input
            type="file"
            name="video"
            onChange={handleInputChange}
            accept="video/*"
            className="w-full p-2 border rounded"
          />
        )}
        <p>Ticket Price: ₦{eventData.ticket_price}</p>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
}