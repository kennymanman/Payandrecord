import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";


const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');


// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase URL or anon key');
// }

// const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'df0wwgkql' // Make sure this is your actual cloud name
  }
});

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching events:', error);
    else setEvents(data);
  }

  const filteredEvents = events.filter(event => 
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || event.plan_id.toString() === filter)
  );

  const planNames = {
    '1': 'Basic',
    '2': 'Standard',
    '3': 'Premium'
  };

  const VideoPlayer = ({ videoUrl }) => {
    if (!videoUrl) return null;
    
    let publicId;
    try {
      // Try to extract the public ID from a full URL
      const url = new URL(videoUrl);
      publicId = url.pathname.split('/').pop().split('.')[0];
    } catch (error) {
      // If URL construction fails, assume videoUrl is already a public ID
      publicId = videoUrl;
    }

    // Remove any file extension if present
    publicId = publicId.split('.')[0];

    const myVideo = cld.video(publicId);

    return (
      <AdvancedVideo
        cldVid={myVideo}
        controls
        width="300"
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Events</h1>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Categories</option>
          <option value="1">Basic</option>
          <option value="2">Standard</option>
          <option value="3">Premium</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{event.event_name}</h2>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <p>Category: {planNames[event.plan_id]}</p>
            <p>Payment: ₦{event.ticket_price || 'N/A'}</p>
            <p>Email: {event.email}</p>
            <p>Phone: {event.phone_number}</p>
            <p>Last Updated: {new Date(event.updated_at).toLocaleString()}</p>
            
            {event.image_url && (
              <img src={event.image_url} alt={event.event_name} className="mt-2 w-full h-40 object-cover" />
            )}
            
            {event.video_url && (
              <div className="mt-2">
                <VideoPlayer videoUrl={event.video_url} />
              </div>
            )}
            
            <Link 
              to={`/event-details/${event.id}`} 
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllEvents;