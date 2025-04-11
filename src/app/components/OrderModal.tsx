/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface OrderModalProps {
  isVisible: boolean;
  order: any | null;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isVisible, order, onClose }) => {
  const { t } = useTranslation();

  if (!order) return null;

  return (
    <Modal
      title={t("orderModal.title")}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.orderId")}</td>
            <td className="p-2 border border-gray-300">{order._id}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.createdAt")}</td>
            <td className="p-2 border border-gray-300">
              {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.customer")}</td>
            <td className="p-2 border border-gray-300">
              {order.user ? `${order.user.firstName} ${order.user.lastName}` : "-"}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.phoneNumber")}</td>
            <td className="p-2 border border-gray-300">
              {order.user ? `${order.user.phoneNumber}` : "-"}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.name")}</td>
            <td className="p-2 border border-gray-300">
              {order.name === "Unnamed Art Toy" ? t("orderModal.unnamedArtToy") : order.name}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.size")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.sizeOptions.${order.size}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.material")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.materialOptions.${order.material}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.painting")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.paintingOptions.${order.painting}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.assembly")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.assemblyOptions.${order.assembly}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.artToy")}</td>
            <td className="p-2 border border-gray-300">
              <img
                src={order.imageUrl}
                alt="Art Toy"
                className="w-52 h-auto"
              />
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.price")}</td>
            <td className="p-2 border border-gray-300">{order.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.shipping")}</td>
            <td className="p-2 border border-gray-300">{order.shipping}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.total")}</td>
            <td className="p-2 border border-gray-300">{order.total.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.address")}</td>
            <td className="p-2 border border-gray-300">
              {order.address
                ? (() => {
                  try {
                    const addressObject = JSON.parse(order.address);
                    return `${addressObject.subdistrict}, ${addressObject.district}, ${addressObject.province}, ${addressObject.postalCode}, ${addressObject.detail}`;
                  } catch (error) {
                    return t("orderModal.invalidAddress");
                  }
                })()
                : t("orderModal.noAddress")}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.confirmation")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.paymentStatus.${order.paymentStatus}`)}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.paymentImage")}</td>
            <td className="p-2 border border-gray-300">
              {order.payment ? (
                <img
                  src={order.payment}
                  alt="Payment"
                  className="w-24 h-24"
                />
              ) : (
                <p>{t("orderModal.noPaymentImage")}</p>
              )}
            </td>
          </tr>
          <tr>
            <td className="p-2 font-bold border border-gray-300">{t("orderModal.status")}</td>
            <td className="p-2 border border-gray-300">{t(`orderModal.statuss.${order.status}`)}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};

export default OrderModal;
