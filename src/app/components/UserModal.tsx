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
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              User ID
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user._id}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Created At
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Email:
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.email}
            </td>
          </tr>

          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Username
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.username}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              First name
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.firstName}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Last name
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.lastName}
            </td>
          </tr>

          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Phone number
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.phoneNumber}
            </td>
          </tr>

          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Role
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.role}
            </td>
          </tr>

          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Status
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.status}
            </td>
          </tr>

          <tr>
            <td
              style={{
                padding: "8px",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Address
            </td>
            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
              {user.address && user.address.length > 0
                ? user.address.map((address: any, index: any) => (
                    <div key={index}>
                      Address {index + 1}: {address.subdistrict},{" "}
                      {address.district}, {address.province},{" "}
                      {address.postalCode}, {address.detail}
                    </div>
                  ))
                : "No address available"}
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default UserModal;
