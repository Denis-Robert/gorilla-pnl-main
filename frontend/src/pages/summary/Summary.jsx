import React from "react";

const Summary = ({ formData, shoppingCart, rlsCart, miscData }) => {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-4">Summary</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">KIF</h3>
        <ul className="list-disc pl-5">
          {Object.entries(formData).map(([key, value]) => (
            <li key={key} className="mb-1">
              <span className="font-semibold">{key}:</span>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Components</h3>
        <ul className="list-disc pl-5">
          {Object.entries(shoppingCart).map(([partNo, details]) => (
            <li key={partNo} className="mb-1">
              <span className="font-semibold">
                {details.name} (Part No: {partNo}):
              </span>{" "}
              Quantity: {details.qty}, Price: {details.total_price}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">RLS</h3>
        <ul className="list-disc pl-5">
          {rlsCart.map((item, index) => (
            <li key={index} className="mb-1">
              <span className="font-semibold">RLS Item {index + 1}:</span> Quantity:{" "}
              {item.manDayQuantities.reduce((acc, curr) => acc + curr.manDays, 0)}, Cost: {item.totalCost}, Level: {item.resource.level},
              Mandays and quantity: {item.manDayQuantities.map(month => `${month.month}: ${month.manDays}`).join(", ")}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">MISC</h3>
        <ul className="list-disc pl-5">
          {Object.entries(miscData).map(([key, value]) => (
            <li key={key} className="mb-1">
              <span className="font-semibold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Summary;
