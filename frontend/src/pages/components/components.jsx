import React, { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';
import './scrollbar.css';
import { Link } from 'react-router-dom';

function Comp({ shoppingCart, setShoppingCart }) {
  const [parts, setParts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("hardware");
  console.log("shoppppppppp"+JSON.stringify(shoppingCart))
  const data_read = async () => {
    if (selectedCategory !== 'hardware') {
      fetch('http://localhost:5000/api/create-quote')
        .then((res) => res.json())
        .then((data) => {
          const filteredParts = data.filter(part => part.part_type === selectedCategory);
          setParts(filteredParts.map(part => ({
            ...part,
            unit_price: part.price // Ensure price is mapped to unit_price
          })));
        });
    }
  };

  useEffect(() => {
    data_read();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (add_part) => {
    const { part_no, unit_price, ...partWithoutNo } = add_part;
    const newItem = {
      ...partWithoutNo,
      qty: 1,
      unit_price: unit_price,
      total_price: unit_price
    };

    if (shoppingCart[part_no]) {
      setShoppingCart(prevShoppingCart => ({
        ...prevShoppingCart,
        [part_no]: {
          ...prevShoppingCart[part_no],
          qty: prevShoppingCart[part_no].qty + 1,
          total_price: (prevShoppingCart[part_no].qty + 1) * unit_price
        }
      }));
    } else {
      setShoppingCart(prevShoppingCart => ({
        ...prevShoppingCart,
        [part_no]: { ...newItem }
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(worksheet, { header: 1 });

      const keys = json[0].map(key => key.trim());
      const values = json.slice(1).map(row => {
        const trimmedRow = {};
        row.forEach((value, index) => {
          trimmedRow[keys[index]] = value;
        });
        return trimmedRow;
      });

      values.forEach((item) => {
        const part_no = item["Part #"];
        const unit_price = item["Unit Price"];

        const newItem = {
          name: item["Product Name"],
          part_no,
          qty: item["Quantity"],
          unit_price: unit_price !== undefined ? Number(unit_price) : 0,
          total_price: (unit_price !== undefined ? Number(unit_price) : 0) * item["Quantity"]
        };

        setShoppingCart(prevShoppingCart => {
          if (prevShoppingCart[part_no]) {
            return {
              ...prevShoppingCart,
              [part_no]: {
                ...prevShoppingCart[part_no],
                qty: prevShoppingCart[part_no].qty + newItem.qty,
                total_price: (prevShoppingCart[part_no].qty + newItem.qty) * newItem.unit_price
              }
            };
          } else {
            return {
              ...prevShoppingCart,
              [part_no]: { ...newItem }
            };
          }
        });
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const increaseQuantity = (index) => {
    const updatedCart = { ...shoppingCart };
    updatedCart[index].qty += 1;
    updatedCart[index].total_price = updatedCart[index].qty * updatedCart[index].unit_price;
    setShoppingCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = { ...shoppingCart };
    if (updatedCart[index].qty > 1) {
      updatedCart[index].qty -= 1;
      updatedCart[index].total_price = updatedCart[index].qty * updatedCart[index].unit_price;
      setShoppingCart(updatedCart);
    } else {
      delete updatedCart[index];
      setShoppingCart(updatedCart);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = { ...shoppingCart };
    delete updatedCart[index];
    setShoppingCart(updatedCart);
  };

  return (
    <div className="bg-white bg-cover m-0 p-0 box-border h-screen text-black">
      <div className="main-content flex justify-between px-20 h-4/5 rounded-3xl mt-10">
        <div className="selection w-2/3 bg-white p-20 border-4 border-indigo-700 rounded-3xl overflow-auto">
          <select value={selectedCategory} onChange={handleCategoryChange} className="w-full py-2 px-3 rounded bg-white text-black border-2 border-indigo-700 mb-5">
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="license">License</option>
          </select>

          {selectedCategory === 'hardware' ? (
            <div>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-5" />
            </div>
          ) : (
            <table className="parts-table w-full text-center text-black">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Domain</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {parts.map(part =>
                  <tr key={part.part_no} className="part-item">
                    <td>{part.name}</td>
                    <td>{part.domain}</td>
                    <td>
                      <button type="button" onClick={() => handleAddToCart(part)} className="bg-indigo-700 text-white border-2 border-indigo-700 rounded px-2 py-2">Add to Cart</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="cart w-1/3 bg-white p-20 border-4 border-indigo-700 overflow-auto ml-10 rounded-3xl text-center">
          <h2 className="text-black text-lg mb-5">Selected Components</h2>
          <div className="cart-summary">
            {Object.keys(shoppingCart).map((key) => (
              <div key={key} className="cart-item-card bg-white border-2 border-indigo-700 rounded-3xl mb-10 p-5">
                <div className="card-content w-full text-center">
                  <h3 className="product-name text-black mb-3">{shoppingCart[key].name}</h3>
                  <p className="unit-price text-black mb-3">Unit Price: {shoppingCart[key].unit_price}</p>
                  <div className="quantity-actions flex justify-center items-center mb-3">
                    <button type="button" onClick={() => decreaseQuantity(key)} className="bg-indigo-700 text-white border-2 border-indigo-700 rounded px-3 py-1">-</button>
                    <span className="quantity text-black mx-5">{shoppingCart[key].qty}</span>
                    <button type="button" onClick={() => increaseQuantity(key)} className="bg-indigo-700 text-white border-2 border-indigo-700 rounded px-3 py-1">+</button>
                  </div>
                  <p className="price text-black mb-3">Total Price: {shoppingCart[key].total_price}</p>
                  <button type="button" className="remove-btn bg-red-600 text-black border-2 border-red-600 rounded px-5 py-2" onClick={() => removeFromCart(key)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comp;
