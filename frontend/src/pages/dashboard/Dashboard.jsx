import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assets/logo1.png';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
 

  useEffect(() => {
    const fetchDeals = async () => {

      fetch('http://127.0.0.1:5000/api/deals')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setDeals(data)
      });
    };

    fetchDeals();
  }, []);

  const handleDelete = async (deal_id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/delete', {

        deal_id,
        
        
        
      });
  
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Failed to delete the deal');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    
  };
  
  return (
    <div className="bg-white h-screen">
      <header className="navbar border-2">
        <nav className="flex justify-between items-center px-10 py-4">
          <Link to="/"><img src={logo} alt="gorilla tech grp" className="h-10" /></Link>
          <h1 className='text-black text-3xl'>Welcome back</h1>
          <h1 className="text-black">PnL Portal</h1>
        </nav>
      </header>

      <div className="flex justify-around p-1 h-5/6 mt-10 mx-auto border-3 border-">
        <div className="border-1 border-indigo-700 p-4 text-center rounded-lg w-4/6 bg-white">
          <div className="subnav flex justify-between items-center text-center mb-4">
            <h1 className="title text-black text-3xl">Deals</h1>
            <Link to="/form">
              <button className='createdeal border-3 bg-indigo-700 hover:bg-indigo-600 px-5 py-3 rounded-2xl text-white'>
                create deal
              </button>
            </Link>
          </div>

          <div className="deal-cards space-y-4 h-4/5 overflow-y-auto">
            {deals.map(deal => (
              <div key={deal.deal_id} className="deal-card bg-indigo-700  border-2 border-white p-4 rounded-3xl flex  justify-between items-center">
                <div className="info flex flex-col justify-between p-10">
                  <span className="deal-id text-white font-bold text-2xl">{deal.customer_name}</span>
                  <span className="deal-id text-white font-normal">{deal.deal_id}</span>
                </div>
                <div className="buttons flex space-x-2">
                <Link to={`/edit/${deal.deal_id}`}>
                    <button className="edit-btn bg-white px-4 py-2 rounded-lg text-indigo-700">edit</button>
                  </Link>
                  <button className="delete-btn bg-white px-4 py-2 rounded-lg text-indigo-700 " onClick={ () => {handleDelete(deal.deal_id)}}>delete</button>
                  <button className="download-btn bg-white px-4 py-2 rounded-lg text-indigo-700 ">download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



