/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface UserModalProps {
  isVisible: boolean;
  user: any | null;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isVisible, user, onClose }) => {
  const { t } = useTranslation(); // ใช้ useTranslation เพื่อเรียกฟังก์ชัน t

  if (!user) return null;

  return (
    <Modal
      title={t("userM.details")} // ใช้ t() เพื่อแปลข้อความ
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="max-h-[60vh] overflow-y-auto"
    >
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.user_id")}</td>
            <td className="p-2 border border-gray-300">{user._id}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.created_at")}</td>
            <td className="p-2 border border-gray-300">
              {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.email")}</td>
            <td className="p-2 border border-gray-300">{user.email}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.username")}</td>
            <td className="p-2 border border-gray-300">{user.username}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.first_name")}</td>
            <td className="p-2 border border-gray-300">{user.firstName}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.last_name")}</td>
            <td className="p-2 border border-gray-300">{user.lastName}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.phone")}</td>
            <td className="p-2 border border-gray-300">{user.phoneNumber}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.role")}</td>
            <td className="p-2 border border-gray-300">{t(`userM.roles.${user.role}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.status")}</td>
            <td className="p-2 border border-gray-300">{t(`userM.statuses.${user.status}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("userM.address")}</td>
            <td className="p-2 border border-gray-300">
              {user.address && user.address.length > 0
                ? user.address.map((address: any, index: any) => (
                  <div key={index} className="mb-2">
                    <span className="font-semibold">{t("userM.address_n", { n: index + 1 })}:</span>{" "}
                    {address.subdistrict}, {address.district}, {address.province},{" "}
                    {address.postalCode}, {address.detail}
                  </div>
                ))
                : t("userM.no_address")}
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default UserModal;