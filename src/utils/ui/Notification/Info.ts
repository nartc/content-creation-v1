import { notification } from 'antd';
import { ReactNode } from 'react';

export const displayInfo = (content: string | ReactNode, onClose?: () => void) => {
  notification.info({
    message: content,
    duration: 1,
    onClose: onClose,
    placement: 'topRight'
  });
};
