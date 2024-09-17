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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{event.event_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
          <p><strong>Category:</strong> {event.plan_id === 1 ? 'Basic' : event.plan_id === 2 ? 'Standard' : 'Premium'}</p>
          <p><strong>Payment:</strong> ₦{event.ticket_price || 'N/A'}</p>
          <p><strong>Email:</strong> {event.email}</p>
          <p><strong>Phone:</strong> {event.phone_number}</p>
          <p><strong>Edit Code:</strong> {event.edit_code}</p>
          <p><strong>Last Updated:</strong> {event.updated_at ? new Date(event.updated_at).toLocaleString() : 'N/A'}</p>
        </div>
        <div>
          {event.image_url && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Event Image</h2>
              <img src={event.image_url} alt="Event" className="max-w-full h-auto" />
            </div>
          )}
          {event.video_url && (
            <div>
              <h2 className="text-xl font-bold mb-2">Event Video</h2>
              <video controls className="max-w-full h-auto">
                <source src={event.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;