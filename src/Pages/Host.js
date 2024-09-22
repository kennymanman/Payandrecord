import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';
import { Cloudinary } from "@cloudinary/url-gen";
import axios from 'axios';

// Initialize EmailJS with your user ID
emailjs.init("RuMFiNq6SrWAWSNiH");

// Initialize Supabase client
const supabase = createClient('https://ktlmyeivrfxrochvwqun.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bG15ZWl2cmZ4cm9jaHZ3cXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNDEwNzAsImV4cCI6MjA0MTgxNzA3MH0.aAozRVTn36LbsHhUPRVaJRs1rOc0Ow37we7TMomdfHs');

// Paystack public key
const paystackPublicKey = 'pk_test_92278ada5a04dc16791879cfae2950afdeacc04e';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'df0wwgkql'
  }
});

export default function Host() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    image: null,
    video: null,
    ticketPrice: '',
    email: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();
  const { planId } = useParams();  // Get the planId from the URL
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (planId) {
      setSelectedPlan(Number(planId));
    }
  }, [planId]);

  const plans = [
    { id: 1, name: 'Basic', price: 1000 },
    { id: 2, name: 'Standard', price: 2000 },
    { id: 3, name: 'Premium', price: 3000 },
  ];

  const handlePlanSelect = (planId) => {
    navigate(`/host/form/${planId}`);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const handlePaymentSuccess = async (response) => {
    console.log('Payment callback received:', response);

    if (!response || response.status !== 'success') {
      console.error('Payment was not successful:', response);
      alert('Payment was not successful. Please try again.');
      return;
    }

    setIsLoading(true);  // Set loading to true when payment is successful

    const uniqueCode = generateUniqueCode();
    
    try {
      console.log('Uploading image:', formData.image);
      const imageUrl = await uploadFile(formData.image, 'event-images');
      console.log('Uploaded image URL:', imageUrl);

      let videoUrl = null;
      if (selectedPlan > 1 && formData.video) {
        try {
          console.log('Uploading video:', formData.video);
          videoUrl = await uploadVideo(formData.video);
          console.log('Uploaded video URL:', videoUrl);
        } catch (videoError) {
          console.error('Error uploading video:', videoError);
          if (videoError.message.includes('File size exceeds 100MB limit')) {
            alert('The video file size exceeds the 100MB limit. Please choose a smaller file.');
          } else {
            alert('There was an error uploading the video. Please try again or contact support.');
          }
          // You might want to return here or set a flag to prevent further processing
          return;
        }
      }

      const eventData = {
        plan_id: selectedPlan,
        event_name: formData.eventName,
        event_date: formData.eventDate,
        image_url: imageUrl,
        video_url: videoUrl,
        ticket_price: formData.ticketPrice || null,
        email: formData.email,
        phone_number: formData.phoneNumber,
        edit_code: uniqueCode,
      };

      console.log('Inserting event data:', eventData);

      const { data, error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) throw error;

      console.log('Data inserted successfully:', data);
      await sendEmail(formData.email, uniqueCode);
      setIsLoading(false);  // Set loading to false before navigating
      navigate('/readme', { state: { uniqueCode, eventName: formData.eventName } });
    } catch (error) {
      console.error('Error in handlePaymentSuccess:', error);
      alert(`Error: ${error.message}. Please try again or contact support.`);
      setIsLoading(false);  // Set loading to false if there's an error
    }
  };

  const sendEmail = async (to, code) => {
    try {
        const result = await emailjs.send(
        "service_ludi8ni",
        "template_sbmswl2",
        {
          to_email: to,
          edit_code: code,
        },
        "RuMFiNq6SrWAWSNiH"
      );
      console.log('Email sent successfully', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const uploadFile = async (file, bucket) => {
    if (!file) {
      console.log(`No file provided for ${bucket}`);
      return null;
    }
    
    console.log(`Attempting to upload file to ${bucket}:`, file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Error uploading to ${bucket}:`, error);
        throw error;
      }

      console.log(`File uploaded successfully to ${bucket}:`, data);

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log(`Public URL for ${bucket}:`, publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error(`Error in uploadFile for ${bucket}:`, error);
      throw error;
    }
  };

  const uploadVideo = async (file) => {
    console.log('File to upload:', file);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    // Check if file size exceeds 100MB (100 * 1024 * 1024 bytes)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      console.error('File size exceeds 100MB limit');
      throw new Error('File size exceeds 100MB limit. Please choose a smaller file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'famousone');

    try {
      console.log('Starting video upload to Cloudinary...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/df0wwgkql/video/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handlePaymentClick = () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }

    const selectedPlanPrice = plans.find(p => p.id === selectedPlan)?.price || 0;

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: formData.email,
      amount: selectedPlanPrice * 100, // amount in kobo
      ref: 'ref-' + Math.floor((Math.random() * 1000000000) + 1),
      callback: function(response) {
        handlePaymentSuccess(response);
      },
      onClose: function() {
        console.log("Payment window closed");
      },
    });
    handler.openIframe();
  };

  //For the loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold">Processing your payment...</p>
          <p className="mt-2">Please wait while we set up your event.</p>
        </div>
      </div>
    );
  }

  if (selectedPlan) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-5">Event Details for {plans.find(p => p.id === selectedPlan)?.name} Plan</h2>
        <form className="space-y-4">
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
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
            accept="image/*"
            className="w-full p-2 border rounded"
            required
          />
          {selectedPlan > 1 && (
            <>
              <input
                type="file"
                name="video"
                onChange={handleInputChange}
                accept="video/*"
                className="w-full p-2 border rounded"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Maximum file size: 100MB</p>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                placeholder="Ticket Price"
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          <button 
            type="button"
            onClick={handlePaymentClick}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Pay Now
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Choose a Payment Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2">₦{plan.price}</p>
            <button
              onClick={() => handlePlanSelect(plan.id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>

    <Link to="/EditEvent">
      <h2>Edit previous button</h2>
      </Link>



<Link to="/all-events">
<h2>All Events Dashboard</h2>
</Link>

    </div>
  );
}
