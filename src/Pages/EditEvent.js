import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');

export default function EditEvent() {
  const [editCode, setEditCode] = useState('');
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    hostName: '',
    hostPhoneNumber: '',
    hostEmailAddress: '',
    eventTitle: '',
    eventAddress: '',
    mapLocation: { latitude: '', longitude: '' },
    eventDescription: '',
    djAppearanceOne: '',
    djAppearanceTwo: '',
    djAppearanceThree: '',
    eventRules: '',
    category: '',
    imagePortrait: null,
    imageLandscape: null,
    ticketOne: { name: '', price: '', description: '', count: '' },
    ticketTwo: { name: '', price: '', description: '', count: '' },
    ticketThree: { name: '', price: '', description: '', count: '' },
    ticketFour: { name: '', price: '', description: '', count: '' },
    ticketFive: { name: '', price: '', description: '', count: '' },
    ticketSix: { name: '', price: '', description: '', count: '' },
    country: '',
    video: null,
  });
  const navigate = useNavigate();

  // Define categories and countries
  const categories = [
    'Party', 'Concert', 'Festival', 'Comedy', 'Theater', 'Sports', 'Wedding'
  ];

  const countries = [
    'Nigeria', 'Ghana', 'South Africa'
  ];

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
        hostName: data.host_name,
        hostPhoneNumber: data.host_phone_number,
        hostEmailAddress: data.host_email_address,
        eventTitle: data.event_title,
        eventAddress: data.event_address,
        mapLocation: { latitude: data.map_location_latitude, longitude: data.map_location_longitude },
        eventDescription: data.event_description,
        djAppearanceOne: data.dj_appearance_one,
        djAppearanceTwo: data.dj_appearance_two,
        djAppearanceThree: data.dj_appearance_three,
        eventRules: data.event_rules,
        category: data.category,
        country: data.country,
        ticketOne: { name: data.ticket_one_name, price: data.ticket_one_price, description: data.ticket_one_description, count: data.ticket_one_count },
        ticketTwo: { name: data.ticket_two_name, price: data.ticket_two_price, description: data.ticket_two_description, count: data.ticket_two_count },
        ticketThree: { name: data.ticket_three_name, price: data.ticket_three_price, description: data.ticket_three_description, count: data.ticket_three_count },
        ticketFour: { name: data.ticket_four_name, price: data.ticket_four_price, description: data.ticket_four_description, count: data.ticket_four_count },
        ticketFive: { name: data.ticket_five_name, price: data.ticket_five_price, description: data.ticket_five_description, count: data.ticket_five_count },
        ticketSix: { name: data.ticket_six_name, price: data.ticket_six_price, description: data.ticket_six_description, count: data.ticket_six_count },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name.includes('.')) {
      const [ticketType, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [ticketType]: {
          ...prev[ticketType],
          [field]: value
        }
      }));
    } else if (name === 'mapLocation') {
      const [latitude, longitude] = value.split(',');
      setFormData(prev => ({
        ...prev,
        mapLocation: { latitude: latitude.trim(), longitude: longitude.trim() }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('events')
      .update({
        host_name: formData.hostName,
        host_phone_number: formData.hostPhoneNumber,
        host_email_address: formData.hostEmailAddress,
        event_title: formData.eventTitle,
        event_address: formData.eventAddress,
        map_location_latitude: parseFloat(formData.mapLocation.latitude),
        map_location_longitude: parseFloat(formData.mapLocation.longitude),
        event_description: formData.eventDescription,
        dj_appearance_one: formData.djAppearanceOne,
        dj_appearance_two: formData.djAppearanceTwo,
        dj_appearance_three: formData.djAppearanceThree,
        event_rules: formData.eventRules,
        category: formData.category,
        // Handle image updates separately
        country: formData.country,
        // Handle ticket updates
        ticket_one_name: formData.ticketOne.name,
        ticket_one_price: parseFloat(formData.ticketOne.price),
        ticket_one_description: formData.ticketOne.description,
        ticket_one_count: parseInt(formData.ticketOne.count),
        ticket_two_name: formData.ticketTwo.name,
        ticket_two_price: parseFloat(formData.ticketTwo.price),
        ticket_two_description: formData.ticketTwo.description,
        ticket_two_count: parseInt(formData.ticketTwo.count),
        ticket_three_name: formData.ticketThree.name,
        ticket_three_price: parseFloat(formData.ticketThree.price),
        ticket_three_description: formData.ticketThree.description,
        ticket_three_count: parseInt(formData.ticketThree.count),
        ticket_four_name: formData.ticketFour.name,
        ticket_four_price: parseFloat(formData.ticketFour.price),
        ticket_four_description: formData.ticketFour.description,
        ticket_four_count: parseInt(formData.ticketFour.count),
        ticket_five_name: formData.ticketFive.name,
        ticket_five_price: parseFloat(formData.ticketFive.price),
        ticket_five_description: formData.ticketFive.description,
        ticket_five_count: parseInt(formData.ticketFive.count),
        ticket_six_name: formData.ticketSix.name,
        ticket_six_price: parseFloat(formData.ticketSix.price),
        ticket_six_description: formData.ticketSix.description,
        ticket_six_count: parseInt(formData.ticketSix.count),
        updated_at: new Date().toISOString(),
      })
      .eq('edit_code', editCode);

    if (error) {
      console.error('Error updating event:', error);
      alert(`Error: ${error.message}`);
    } else {
      console.log('Event updated successfully:', data);
      navigate('/success');
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
          name="hostName"
          value={formData.hostName}
          onChange={handleInputChange}
          placeholder="Host Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="hostPhoneNumber"
          value={formData.hostPhoneNumber}
          onChange={handleInputChange}
          placeholder="Host Phone Number"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="hostEmailAddress"
          value={formData.hostEmailAddress}
          onChange={handleInputChange}
          placeholder="Host Email Address"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="eventTitle"
          value={formData.eventTitle}
          onChange={handleInputChange}
          placeholder="Event Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="eventAddress"
          value={formData.eventAddress}
          onChange={handleInputChange}
          placeholder="Event Address"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="mapLocation"
          value={`${formData.mapLocation.latitude},${formData.mapLocation.longitude}`}
          onChange={handleInputChange}
          placeholder="Map Location (Latitude, Longitude)"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="eventDescription"
          value={formData.eventDescription}
          onChange={handleInputChange}
          placeholder="Event Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="djAppearanceOne"
          value={formData.djAppearanceOne}
          onChange={handleInputChange}
          placeholder="DJ Appearance One"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="djAppearanceTwo"
          value={formData.djAppearanceTwo}
          onChange={handleInputChange}
          placeholder="DJ Appearance Two"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="djAppearanceThree"
          value={formData.djAppearanceThree}
          onChange={handleInputChange}
          placeholder="DJ Appearance Three"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="eventRules"
          value={formData.eventRules}
          onChange={handleInputChange}
          placeholder="Event Rules"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <input
          type="file"
          name="imagePortrait"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="imageLandscape"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        {/* Ticket inputs */}
        {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((num) => (
          <div key={`ticket${num}`} className="mb-4">
            <h3 className="font-semibold mb-2">Ticket {num}</h3>
            <input
              type="text"
              name={`ticket${num}.name`}
              value={formData[`ticket${num}`].name}
              onChange={handleInputChange}
              placeholder="Ticket Name"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              name={`ticket${num}.price`}
              value={formData[`ticket${num}`].price}
              onChange={handleInputChange}
              placeholder="Ticket Price"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              name={`ticket${num}.description`}
              value={formData[`ticket${num}`].description}
              onChange={handleInputChange}
              placeholder="Ticket Description"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              name={`ticket${num}.count`}
              value={formData[`ticket${num}`].count}
              onChange={handleInputChange}
              placeholder="Ticket Count"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        {eventData && eventData.plan_id > 1 && (
          <input
            type="file"
            name="video"
            onChange={handleInputChange}
            accept="video/*"
            className="w-full p-2 border rounded"
          />
        )}
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
}