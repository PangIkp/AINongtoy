/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";

interface KeywordModalProps {
  isVisible: boolean;
  keyword: any | null;
  onClose: () => void;
}

const KeywordModal: React.FC<KeywordModalProps> = ({ isVisible, keyword, onClose }) => {
  if (!keyword) return null;

  return (
    <Modal
      title="Keyword Details"
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
              {keyword._id}
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
              {dayjs(keyword.createdAt).format("DD/MM/YYYY HH:mm")}
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
              {keyword.email}
            </td>
          </tr> 
        </tbody>
      </table>
    </Modal>
  );
};

export default KeywordModal;
