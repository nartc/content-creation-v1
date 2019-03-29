import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import React, { FC, ReactNode } from 'react';

interface ITooltipWrapperProps {
  render: () => ReactNode;
  title: string;
  placement?: TooltipPlacement;
}

export const TooltipWrapper: FC<ITooltipWrapperProps> = ({ placement = 'top', render, title }) => (
  <Tooltip placement={placement} autoAdjustOverflow arrowPointAtCenter={false} title={title}>
    {render()}
  </Tooltip>
);
