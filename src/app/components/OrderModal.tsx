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
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <tbody>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Order ID:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order._id}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Created At:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Customer:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.user}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Name:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.name}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Size:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.size}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Material:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.material}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Painting:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.painting}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Assembly:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.assembly}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Art toy:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              <img
                src={order.imageUrl}
                alt="Art Toy"
                style={{ width: "200px", height: "auto" }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Price:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Shipping:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.shipping}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Total:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.total.toLocaleString()}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Address:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {order.address
                ? (() => {
                    try {
                      const addressObject = JSON.parse(order.address); // Parse the address
                      return `${addressObject.subdistrict}, ${addressObject.district}, ${addressObject.province}, ${addressObject.postalCode}, ${addressObject.detail}`;
                    } catch (error) {
                      return "Invalid address format"; // If parsing fails
                    }
                  })()
                : "No address provided"}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Confirmation:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.paymentStatus}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Payment Status:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {order.payment ? (
                <img
                  src={order.payment} // Base64 encoded image for payment status
                  alt="Payment Status"
                  style={{ width: "100px", height: "100px" }} // Adjust the size
                />
              ) : (
                "No payment image available"
              )}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Status:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{order.status}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default OrderModal;
