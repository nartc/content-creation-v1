import { ICanvasContextReducerActions, ICanvasContextState } from '@contexts/CanvasContext';
import { CanvasHandler } from '@utils/fabric/CanvasHandler';
import { TooltipWrapper } from '@utils/ui/Ant';
import { FlexBox } from '@utils/ui/Flex';
import { Icon, Typography } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { TooltipPlacement } from 'antd/lib/tooltip';
import React, { Dispatch, FC, ReducerAction, SVGProps } from 'react';
import styled, { CSSObject } from 'styled-components';

const ToolTitle = styled(Typography.Text)`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

interface IToolWrapperProps {
  title: string;
  isWrapped?: boolean;
}

export const ToolWrapper: FC<IToolWrapperProps> = ({ title, children, isWrapped = false }) => {
  return (
    <FlexBox flexDirection={'column'}>
      <ToolTitle>{title}</ToolTitle>
      <FlexBox justifyContent={'space-between'} alignItems={'center'} flexWrap={isWrapped ? 'wrap' : 'nowrap'}>
        {children}
      </FlexBox>
    </FlexBox>
  );
};

interface IToolIconProps extends IconProps {
  tooltip: string;
  placement?: TooltipPlacement;
  shouldDisabled?: boolean;
  svgIcon?: FC<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

export const ToolIcon: FC<IToolIconProps> = (
  {
    placement,
    shouldDisabled = false,
    isActive = false,
    svgIcon: Svg,
    type,
    onClick,
    tooltip,
    style
  }
) => {
  const activeColorStyle = isActive ? { color: '#f37920' } : { color: 'currentColor' };

  if (type) {
    if (shouldDisabled) {
      const DisabledAntIcon = styled(Icon)(antToolIconDisabledStyles);
      return <TooltipWrapper render={() => <DisabledAntIcon style={{ ...style }} type={type} onClick={onClick}/>}
                             title={tooltip}
                             placement={placement}/>;
    }

    return <TooltipWrapper render={() => <Icon type={type}
                                               style={{
                                                 fontSize: 18,
                                                 cursor: 'pointer', ...style, ...activeColorStyle
                                               }}
                                               onClick={onClick}
                                               title={'test'}/>}
                           title={tooltip}
                           placement={placement}/>;
  }

  if (shouldDisabled) {
    const DisabledIcon = styled(Icon)(svgToolIconDisabledStyles);
    return <TooltipWrapper render={() => <DisabledIcon style={{ ...style }}
                                                       component={() => <Svg width={18}/>}
                                                       onClick={onClick}/>}
                           title={tooltip}
                           placement={placement}/>;
  }

  return <TooltipWrapper render={() => <Icon component={() => <Svg width={18}/>}
                                             style={{ cursor: 'pointer', ...style, ...activeColorStyle }}
                                             onClick={onClick}/>}
                         title={tooltip}
                         placement={placement}/>;
};

export const svgToolIconDisabledStyles: CSSObject = {
  cursor: 'not-allowed',
  pointerEvents: 'none',
  g: {
    fill: 'lightgrey',
    stroke: 'lightgrey',
    polygon: {
      fill: 'lightgrey !important'
    },
    path: {
      fill: 'lightgrey !important'
    }
  }
};

export const antToolIconDisabledStyles: CSSObject = {
  cursor: 'not-allowed',
  pointerEvents: 'none',
  svg: {
    fill: 'lightgrey'
  },
  fontSize: 18
};

export interface IToolWithProps {
  canvasHandler: CanvasHandler;
  canvasContextDispatcher: Dispatch<ReducerAction<(state: ICanvasContextState, action: ICanvasContextReducerActions) => Partial<ICanvasContextState>>>;
  isActiveSelection: boolean;
}
