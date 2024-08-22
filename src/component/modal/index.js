import { Modal } from "antd";
import React from "react";

const ModalDisplay = ({
  onOK,
  open,
  width,
  title,
  style,
  footer,
  onCancel,
  children,
  className,
  destroyOnClose,
}) => {
  return (
    <Modal
      forceRender
      open={open}
      onOk={onOK}
      style={style}
      width={width}
      title={title}
      footer={footer}
      onCancel={onCancel}
      className={className}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </Modal>
  );
};
export default ModalDisplay;
