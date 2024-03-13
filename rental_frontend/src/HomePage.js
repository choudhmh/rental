import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from "axios";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

// import { dataDigitalBestSeller } from './data';

function HomePage() {
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/display");
        setDisplay(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleErrorImage = (event, property) => {
    console.error(`Error loading image for property: ${property.title}`, event);
  };

  const propDetails = display.map((property, index) => (
    <div key={index} className="card">
      <div className="card-top">
      <img
  src={`http://localhost:8081/${property.image1}`}
  alt={property.title}
  onError={(event) => handleErrorImage(event, property)}
/>
        <h1>{property.title}</h1>
      </div>
      <div className="card-bottom">
        <h3>{property.price}</h3>
        <span className="category">{property.description}</span>
      </div>
    </div>
  ));

  return (
    <div>
      <h2>HomePage</h2>
      <Slider {...settings}>
        {propDetails}
      </Slider>
    </div>
  )
}

export default HomePage;
