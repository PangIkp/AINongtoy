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
      className="max-h-[60vh] overflow-y-auto"
    >
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="p-2 font-bold border border-gray-300">User ID</td>
            <td className="p-2 border border-gray-300">{keyword._id}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Created At</td>
            <td className="p-2 border border-gray-300">
              {dayjs(keyword.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">Email</td>
            <td className="p-2 border border-gray-300">{keyword.email}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default KeywordModal;