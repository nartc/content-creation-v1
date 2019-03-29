import isEqual from 'lodash.isequal';
import { PropsWithChildren } from 'react';

export const arePropsEqual = <P extends object>(...keys: Array<keyof P>) => {
  return (prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) => {
    if (keys.length === 1) {
      return isEqual(prevProps[keys[0]], nextProps[keys[0]]);
    }

    const result: boolean[] = [];
    for (let i = 0, length = keys.length; i < length; i++) {
      result.push(isEqual(prevProps[keys[i]], nextProps[keys[i]]));
    }

    return result.every(item => item === true);
  };
};
