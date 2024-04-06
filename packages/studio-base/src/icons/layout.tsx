import React from 'react';
import { IconWrapper } from './util';
import type { IconWrapperProps } from './util';

const Icon = (props: IconWrapperProps) => {
  return (
    <IconWrapper {...props}>
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor">
        <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-696 72h136v656H184V184z m656 656H384V384h456v456zM384 320V184h456v136H384z"></path>
      </svg>
    </IconWrapper>
  );
};

export default Icon;
