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

// export default function Host() {
  
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [formData, setFormData] = useState({
//     hostName: '',
//     hostPhoneNumber: '',
//     hostEmailAddress: '',
//     eventTitle: '',
//     eventAddress: '',
//     mapLocation: { latitude: '', longitude: '' },
//     eventDescription: '',
//     djAppearanceOne: '',
//     djAppearanceTwo: '',
//     djAppearanceThree: '',
//     eventRules: '',
//     category: '',
//     imagePortrait: null,
//     imageLandscape: null,
//     ticketOne: { name: '', price: '', description: '', count: '' },
//     ticketTwo: { name: '', price: '', description: '', count: '' },
//     ticketThree: { name: '', price: '', description: '', count: '' },
//     ticketFour: { name: '', price: '', description: '', count: '' },
//     ticketFive: { name: '', price: '', description: '', count: '' },
//     ticketSix: { name: '', price: '', description: '', count: '' },
//     country: '',
//     eventName: '',
//     eventDate: '',
//     image: null,
//     video: null,
//     ticketPrice: '',
//     email: '',
//     phoneNumber: '',
//   });
//   const navigate = useNavigate();
//   const { planId } = useParams();  // Get the planId from the URL
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (planId) {
//       setSelectedPlan(Number(planId));
//     }
//   }, [planId]);

//   const plans = [
//     { id: 1, name: 'Basic', price: 20000 },
//     { id: 2, name: 'Standard', price: 45000 },
//     { id: 3, name: 'Premium', price: 100000 },
//   ];

//   const categories = [
//     'Party', 'Concert', 'Festival', 'Comedy', 'Theater', 'Sports', 'Wedding'
//   ];

//   const countries = [
//     'Nigeria', 'Ghana', 'South Africa'
//   ];

//   const handlePlanSelect = (planId) => {
//     navigate(`/host/form/${planId}`);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name.includes('.')) {
//       const [ticketType, field] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [ticketType]: {
//           ...prev[ticketType],
//           [field]: value
//         }
//       }));
//     } else if (name === 'mapLocation') {
//       const [latitude, longitude] = value.split(',');
//       setFormData(prev => ({
//         ...prev,
//         mapLocation: { latitude: latitude.trim(), longitude: longitude.trim() }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: files ? files[0] : value
//       }));
//     }
//   };

//   const generateUniqueCode = () => {
//     return Math.random().toString(36).substring(2, 9).toUpperCase();
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment callback received:', response);

//     if (!response || response.status !== 'success') {
//       console.error('Payment was not successful:', response);
//       alert('Payment was not successful. Please try again.');
//       return;
//     }

//     setIsLoading(true);  // Set loading to true when payment is successful

//     const uniqueCode = generateUniqueCode();
    
//     try {
//       console.log('Uploading images:', formData.imagePortrait, formData.imageLandscape);
//       const imagePortraitUrl = await uploadFile(formData.imagePortrait, 'event-images');
//       const imageLandscapeUrl = await uploadFile(formData.imageLandscape, 'event-images');
//       console.log('Uploaded image URLs:', imagePortraitUrl, imageLandscapeUrl);

//       let videoUrl = null;
//       if (selectedPlan > 1 && formData.video) {
//         try {
//           console.log('Uploading video:', formData.video);
//           videoUrl = await uploadVideo(formData.video);
//           console.log('Uploaded video URL:', videoUrl);
//         } catch (videoError) {
//           console.error('Error uploading video:', videoError);
//           if (videoError.message.includes('File size exceeds 100MB limit')) {
//             alert('The video file size exceeds the 100MB limit. Please choose a smaller file.');
//           } else {
//             alert('There was an error uploading the video. Please try again or contact support.');
//           }
//           // You might want to return here or set a flag to prevent further processing
//           return;
//         }
//       }

//       const eventData = {
//         plan_id: selectedPlan,
//         host_name: formData.hostName,
//         host_phone_number: formData.hostPhoneNumber,
//         host_email_address: formData.hostEmailAddress,
//         event_title: formData.eventTitle,
//         event_address: formData.eventAddress,
//         map_location_latitude: parseFloat(formData.mapLocation.latitude),
//         map_location_longitude: parseFloat(formData.mapLocation.longitude),
//         event_description: formData.eventDescription,
//         dj_appearance_one: formData.djAppearanceOne,
//         dj_appearance_two: formData.djAppearanceTwo,
//         dj_appearance_three: formData.djAppearanceThree,
//         event_rules: formData.eventRules,
//         category: formData.category,
//         image_portrait_url: imagePortraitUrl,
//         image_landscape_url: imageLandscapeUrl,
//         ticket_one_name: formData.ticketOne.name,
//         ticket_one_price: parseFloat(formData.ticketOne.price),
//         ticket_one_description: formData.ticketOne.description,
//         ticket_one_count: parseInt(formData.ticketOne.count),
//         ticket_two_name: formData.ticketTwo.name,
//         ticket_two_price: parseFloat(formData.ticketTwo.price),
//         ticket_two_description: formData.ticketTwo.description,
//         ticket_two_count: parseInt(formData.ticketTwo.count),
//         ticket_three_name: formData.ticketThree.name,
//         ticket_three_price: parseFloat(formData.ticketThree.price),
//         ticket_three_description: formData.ticketThree.description,
//         ticket_three_count: parseInt(formData.ticketThree.count),
//         ticket_four_name: formData.ticketFour.name,
//         ticket_four_price: parseFloat(formData.ticketFour.price),
//         ticket_four_description: formData.ticketFour.description,
//         ticket_four_count: parseInt(formData.ticketFour.count),
//         ticket_five_name: formData.ticketFive.name,
//         ticket_five_price: parseFloat(formData.ticketFive.price),
//         ticket_five_description: formData.ticketFive.description,
//         ticket_five_count: parseInt(formData.ticketFive.count),
//         ticket_six_name: formData.ticketSix.name,
//         ticket_six_price: parseFloat(formData.ticketSix.price),
//         ticket_six_description: formData.ticketSix.description,
//         ticket_six_count: parseInt(formData.ticketSix.count),
//         video_url: videoUrl,
//         edit_code: uniqueCode,
//         country: formData.country,
//       };

//       console.log('Inserting event data:', eventData);

//       const { data, error } = await supabase
//         .from('events')
//         .insert([eventData]);

//       if (error) throw error;

//       console.log('Data inserted successfully:', data);
//       await sendEmail(formData.email, uniqueCode);
//       setIsLoading(false);  // Set loading to false before navigating
//       navigate('/readme', { state: { uniqueCode, eventName: formData.eventName } });
//     } catch (error) {
//       console.error('Error in handlePaymentSuccess:', error);
//       alert(`Error: ${error.message}. Please try again or contact support.`);
//       setIsLoading(false);  // Set loading to false if there's an error
//     }
//   };

//   const sendEmail = async (to, code) => {
//     try {
//         const result = await emailjs.send(
//         "service_ludi8ni",
//         "template_sbmswl2",
//         {
//           to_email: to,
//           edit_code: code,
//         },
//         "RuMFiNq6SrWAWSNiH"
//       );
//       console.log('Email sent successfully', result);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };

//   const uploadFile = async (file, bucket) => {
//     if (!file) {
//       console.log(`No file provided for ${bucket}`);
//       return null;
//     }
    
//     console.log(`Attempting to upload file to ${bucket}:`, file);

//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const filePath = `${fileName}`;

//     try {
//       const { data, error } = await supabase.storage
//         .from(bucket)
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       if (error) {
//         console.error(`Error uploading to ${bucket}:`, error);
//         throw error;
//       }

//       console.log(`File uploaded successfully to ${bucket}:`, data);

//       // Get the public URL
//       const { data: publicUrlData } = supabase.storage
//         .from(bucket)
//         .getPublicUrl(filePath);

//       console.log(`Public URL for ${bucket}:`, publicUrlData.publicUrl);
//       return publicUrlData.publicUrl;
//     } catch (error) {
//       console.error(`Error in uploadFile for ${bucket}:`, error);
//       throw error;
//     }
//   };

//   const uploadVideo = async (file) => {
//     console.log('File to upload:', file);
//     console.log('File name:', file.name);
//     console.log('File type:', file.type);
//     console.log('File size:', file.size);

//     // Check if file size exceeds 100MB (100 * 1024 * 1024 bytes)
//     const maxSize = 100 * 1024 * 1024; // 100MB in bytes
//     if (file.size > maxSize) {
//       console.error('File size exceeds 100MB limit');
//       throw new Error('File size exceeds 100MB limit. Please choose a smaller file.');
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'famousone');

//     try {
//       console.log('Starting video upload to Cloudinary...');
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/df0wwgkql/video/upload`,
//         {
//           method: 'POST',
//           body: formData
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Upload successful:', data);
//       return data.secure_url;
//     } catch (error) {
//       console.error('Upload failed:', error);
//       throw error;
//     }
//   };

//   const handlePaymentClick = () => {
//     if (!formData.hostEmailAddress) {
//       alert('Please enter your email address in the Host Email Address field');
//       return;
//     }

//     const selectedPlanPrice = plans.find(p => p.id === selectedPlan)?.price || 0;

//     const handler = window.PaystackPop.setup({
//       key: paystackPublicKey,
//       email: formData.hostEmailAddress,
//       amount: selectedPlanPrice * 100, // amount in kobo
//       ref: 'ref-' + Math.floor((Math.random() * 1000000000) + 1),
//       callback: function(response) {
//         handlePaymentSuccess(response);
//       },
//       onClose: function() {
//         console.log("Payment window closed");
//       },
//     });
//     handler.openIframe();
//   };

//   //For the loading State
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-xl font-semibold">Processing your payment...</p>
//           <p className="mt-2">Please wait while we set up your event.</p>
//         </div>
//       </div>
//     );
//   }

//   if (selectedPlan) {
//     return (
//       <div className="max-w-md mx-auto mt-10">
//         <h2 className="text-2xl font-bold mb-5">Event Details for {plans.find(p => p.id === selectedPlan)?.name} Plan</h2>
//         <form className="space-y-4">
//           <input
//             type="text"
//             name="hostName"
//             value={formData.hostName}
//             onChange={handleInputChange}
//             placeholder="Host Name"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="tel"
//             name="hostPhoneNumber"
//             value={formData.hostPhoneNumber}
//             onChange={handleInputChange}
//             placeholder="Host Phone Number"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="email"
//             name="hostEmailAddress"
//             value={formData.hostEmailAddress}
//             onChange={handleInputChange}
//             placeholder="Host Email Address"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             name="eventTitle"
//             value={formData.eventTitle}
//             onChange={handleInputChange}
//             placeholder="Event Title"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             name="eventAddress"
//             value={formData.eventAddress}
//             onChange={handleInputChange}
//             placeholder="Event Address"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             name="mapLocation"
//             value={`${formData.mapLocation.latitude},${formData.mapLocation.longitude}`}
//             onChange={handleInputChange}
//             placeholder="Map Location (Latitude, Longitude)"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <textarea
//             name="eventDescription"
//             value={formData.eventDescription}
//             onChange={handleInputChange}
//             placeholder="Event Description"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             name="djAppearanceOne"
//             value={formData.djAppearanceOne}
//             onChange={handleInputChange}
//             placeholder="DJ Appearance One"
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="djAppearanceTwo"
//             value={formData.djAppearanceTwo}
//             onChange={handleInputChange}
//             placeholder="DJ Appearance Two"
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="djAppearanceThree"
//             value={formData.djAppearanceThree}
//             onChange={handleInputChange}
//             placeholder="DJ Appearance Three"
//             className="w-full p-2 border rounded"
//           />
//           <textarea
//             name="eventRules"
//             value={formData.eventRules}
//             onChange={handleInputChange}
//             placeholder="Event Rules"
//             className="w-full p-2 border rounded"
//           />
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map(category => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
//           <div>
//             <label className="block mb-2">Image Portrait</label>
//             <input
//               type="file"
//               name="imagePortrait"
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Image Landscape</label>
//             <input
//               type="file"
//               name="imageLandscape"
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((num) => (
//             <div key={`ticket${num}`} className="mb-4">
//               <h3 className="font-semibold mb-2">Ticket {num}</h3>
//               <input
//                 type="text"
//                 name={`ticket${num}.name`}
//                 value={formData[`ticket${num}`].name}
//                 onChange={handleInputChange}
//                 placeholder="Ticket Name"
//                 className="w-full p-2 border rounded mb-2"
//               />
//               <input
//                 type="number"
//                 name={`ticket${num}.price`}
//                 value={formData[`ticket${num}`].price}
//                 onChange={handleInputChange}
//                 placeholder="Ticket Price"
//                 className="w-full p-2 border rounded mb-2"
//               />
//               <input
//                 type="text"
//                 name={`ticket${num}.description`}
//                 value={formData[`ticket${num}`].description}
//                 onChange={handleInputChange}
//                 placeholder="Ticket Description"
//                 className="w-full p-2 border rounded mb-2"
//               />
//               <input
//                 type="number"
//                 name={`ticket${num}.count`}
//                 value={formData[`ticket${num}`].count}
//                 onChange={handleInputChange}
//                 placeholder="Ticket Count"
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           ))}
//           <select
//             name="country"
//             value={formData.country}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="">Select a country</option>
//             {countries.map(country => (
//               <option key={country} value={country}>{country}</option>
//             ))}
//           </select>
//           <input
//             type="text"
//             name="eventName"
//             value={formData.eventName}
//             onChange={handleInputChange}
//             placeholder="Event Name"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="date"
//             name="eventDate"
//             value={formData.eventDate}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div>
//             <label className="block mb-2">Image</label>
//             <input
//               type="file"
//               name="image"
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block mb-2">Video</label>
//             <input
//               type="file"
//               name="video"
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <input
//             type="number"
//             name="ticketPrice"
//             value={formData.ticketPrice}
//             onChange={handleInputChange}
//             placeholder="Ticket Price"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Email"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleInputChange}
//             placeholder="Phone Number"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <button
//             type="button"
//             onClick={handlePaymentClick}
//             className="w-full bg-blue-500 text-white p-2 rounded"
//           >
//             Pay Now
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h2 className="text-2xl font-bold mb-5">Select a Plan</h2>
//       <div className="space-y-4">
//         {plans.map(plan => (
//           <div key={plan.id} className="border p-4 rounded shadow">
//             <h3 className="text-xl font-semibold">{plan.name}</h3>
//             <p>Price: ₦{plan.price}</p>
//             <button
//               onClick={() => handlePlanSelect(plan.id)}
//               className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Select
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





export default function Host() {
  
  const [selectedPlan, setSelectedPlan] = useState(null);
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
    { id: 1, name: 'Basic', price: 20000 },
    { id: 2, name: 'Standard', price: 45000 },
    { id: 3, name: 'Premium', price: 100000 },
  ];

  const categories = [
    'Party', 'Concert', 'Festival', 'Comedy', 'Theater', 'Sports', 'Wedding'
  ];

  const countries = [
    'Nigeria', 'Ghana', 'South Africa'
  ];

  const handlePlanSelect = (planId) => {
    navigate(`/host/form/${planId}`);
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
      console.log('Uploading images:', formData.imagePortrait, formData.imageLandscape);
      const imagePortraitUrl = await uploadFile(formData.imagePortrait, 'event-images');
      const imageLandscapeUrl = await uploadFile(formData.imageLandscape, 'event-images');
      console.log('Uploaded image URLs:', imagePortraitUrl, imageLandscapeUrl);

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
        image_portrait_url: imagePortraitUrl,
        image_landscape_url: imageLandscapeUrl,
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
        video_url: videoUrl,
        edit_code: uniqueCode,
        country: formData.country,
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
    if (!formData.hostEmailAddress) {
      alert('Please enter your email address in the Host Email Address field');
      return;
    }

    const selectedPlanPrice = plans.find(p => p.id === selectedPlan)?.price || 0;

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: formData.hostEmailAddress,
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
            required
          />
          <input
            type="file"
            name="imageLandscape"
            onChange={handleInputChange}
            accept="image/*"
            className="w-full p-2 border rounded"
            required
          />
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
