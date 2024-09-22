import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');

function EventDetails() {
  const [event, setEvent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  async function fetchEventDetails() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) console.error('Error fetching event details:', error);
    else setEvent(data);
  }

  if (!event) return <div>Loading...</div>;

  const planNames = {
    1: 'Basic',
    2: 'Standard',
    3: 'Premium'
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{event.event_title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Host Name:</strong> {event.host_name}</p>
          <p><strong>Host Phone Number:</strong> {event.host_phone_number}</p>
          <p><strong>Host Email Address:</strong> {event.host_email_address}</p>
          <p><strong>Event Address:</strong> {event.event_address}</p>
          <p><strong>Map Location:</strong> Latitude: {event.map_location_latitude}, Longitude: {event.map_location_longitude}</p>
          <p><strong>Event Description:</strong> {event.event_description}</p>
          <p><strong>DJ Appearance 1:</strong> {event.dj_appearance_one || 'N/A'}</p>
          <p><strong>DJ Appearance 2:</strong> {event.dj_appearance_two || 'N/A'}</p>
          <p><strong>DJ Appearance 3:</strong> {event.dj_appearance_three || 'N/A'}</p>
          <p><strong>Event Rules:</strong> {event.event_rules}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Country:</strong> {event.country}</p>
          <p><strong>Plan:</strong> {planNames[event.plan_id]}</p>
          <p><strong>Edit Code:</strong> {event.edit_code}</p>
          <p><strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(event.updated_at).toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Tickets</h2>
          {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((num) => (
            event[`ticket_${num.toLowerCase()}_name`] && (
              <div key={num} className="mb-2">
                <h3 className="font-bold">Ticket {num}</h3>
                <p><strong>Name:</strong> {event[`ticket_${num.toLowerCase()}_name`]}</p>
                <p><strong>Price:</strong> ₦{event[`ticket_${num.toLowerCase()}_price`]}</p>
                <p><strong>Description:</strong> {event[`ticket_${num.toLowerCase()}_description`]}</p>
                <p><strong>Count:</strong> {event[`ticket_${num.toLowerCase()}_count`]}</p>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Media</h2>
        {event.image_portrait_url && (
          <div className="mb-4">
            <h3 className="font-bold">Portrait Image</h3>
            <img src={event.image_portrait_url} alt="Event Portrait" className="max-w-full h-auto" />
          </div>
        )}
        {event.image_landscape_url && (
          <div className="mb-4">
            <h3 className="font-bold">Landscape Image</h3>
            <img src={event.image_landscape_url} alt="Event Landscape" className="max-w-full h-auto" />
          </div>
        )}
        {event.video_url && (
          <div>
            <h3 className="font-bold">Event Video</h3>
            <video controls className="max-w-full h-auto">
              <source src={event.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;