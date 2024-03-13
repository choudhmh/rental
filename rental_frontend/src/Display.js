import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './style.css';


const Display = () => {
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

  const propDetails = display.map((property, index) => (
    <tr key={index}>
      <td >{property.propertyID}</td>
      <td>{property.title}</td>
      <td>{property.description}</td>
      <td>{property.address}</td>
      <td>{property.postcode}</td>
      <td>{property.email}</td>
      <td>
        {property.image1 && (
          <img
            src={`http://localhost:8081/${property.image1}`}
            alt="property"
            style={{ width: "100px" }}
          />
        )}
      </td>
      <td>{property.price}</td>
      <td>{property.contact}</td>
      <td>
        <button className="button primary edit">
      <Link to={`/update/${property.propertyID}`}>Update</Link></button>
      <button className="button primary delete">
        <Link to={`/delete/${property.propertyID}`} className="btn btn-danger btn-sm">Delete</Link></button>
      </td>
    </tr>
  ));

  return (
    
    <div>
    
      <div>For Admin Use</div>
      {display.length !== 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Address</th>
              <th scope="col">Postcode</th>
              <th scope="col">Email</th>
              <th scope="col">Images</th>
              <th scope="col">Price</th>
              <th scope="col">Contact</th>
            </tr>
          </thead>
          <tbody>{propDetails}</tbody>
        </table>
      ) : (
        <h2>No Records Found</h2>
      )}
    </div>
   
  );
};

export default Display;
