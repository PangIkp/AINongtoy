import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";

interface UserModalProps {
  isVisible: boolean;
  user: any | null;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isVisible, user, onClose }) => {
  if (!user) return null;

  return (
    <Modal
      title="User Details"
      open={isVisible} 
      onCancel={onClose}
      footer={null}
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <tbody>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Order ID:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user._id}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Created At:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Customer:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.user}</td>
          </tr>
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold", border: "1px solid #ddd" }}>Name:</td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>{user.name}</td>
          </tr>
    
        
        </tbody>
      </table>
    </Modal>
  );
};

export default UserModal;
