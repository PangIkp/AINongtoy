/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";

interface OrderModalProps {
  isVisible: boolean;
  order: any | null;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isVisible, order, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      title="Order Details"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Order ID</td>
            <td className="p-2 border border-gray-300">{order._id}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Created At</td>
            <td className="p-2 border border-gray-300">
              {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Customer</td>
            <td className="p-2 border border-gray-300">
              {order.user ? `${order.user.firstName} ${order.user.lastName}` : "-"}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Phone number</td>
            <td className="p-2 border border-gray-300">
              {order.user ? `${order.user.phoneNumber}` : "-"}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Name</td>
            <td className="p-2 border border-gray-300">{order.name}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Size</td>
            <td className="p-2 border border-gray-300">{order.size}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Material</td>
            <td className="p-2 border border-gray-300">{order.material}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Painting</td>
            <td className="p-2 border border-gray-300">{order.painting}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Assembly</td>
            <td className="p-2 border border-gray-300">{order.assembly}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Art toy</td>
            <td className="p-2 border border-gray-300">
              <img
                src={order.imageUrl}
                alt="Art Toy"
                className="w-52 h-auto"
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Price</td>
            <td className="p-2 border border-gray-300">{order.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Shipping</td>
            <td className="p-2 border border-gray-300">{order.shipping}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Total</td>
            <td className="p-2 border border-gray-300">{order.total.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Address</td>
            <td className="p-2 border border-gray-300">
              {order.address
                ? (() => {
                  try {
                    const addressObject = JSON.parse(order.address);
                    return `${addressObject.subdistrict}, ${addressObject.district}, ${addressObject.province}, ${addressObject.postalCode}, ${addressObject.detail}`;
                  } catch (error) {
                    return "Invalid address format";
                  }
                })()
                : "No address provided"}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Confirmation</td>
            <td className="p-2 border border-gray-300">{order.paymentStatus}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Payment Status</td>
            <td className="p-2 border border-gray-300">
              {order.payment ? (
                <img
                  src={order.payment}
                  alt="Payment Status"
                  className="w-24 h-24"
                />
              ) : (
                "No payment image available"
              )}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Status</td>
            <td className="p-2 border border-gray-300">{order.status}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default OrderModal;
