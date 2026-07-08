"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface KeywordModalProps {
  isVisible: boolean;
  keyword: any | null;
  onClose: () => void;
}

const KeywordModal: React.FC<KeywordModalProps> = ({ isVisible, keyword, onClose }) => {
  const { t } = useTranslation();

  if (!keyword) return null;

  return (
    <Modal
      title={t("keywordModal.title")}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="max-h-[60vh] overflow-y-auto"
    >
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("keywordModal.userId")}</td>
            <td className="p-2 border border-gray-300">{keyword._id}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("keywordModal.createdAt")}</td>
            <td className="p-2 border border-gray-300">
              {dayjs(keyword.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("keywordModal.email")}</td>
            <td className="p-2 border border-gray-300">{keyword.email}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default KeywordModal;
