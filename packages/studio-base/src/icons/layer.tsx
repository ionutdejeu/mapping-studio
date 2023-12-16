import React from 'react';
import { IconWrapper } from './util';
import type { IconWrapperProps } from './util';

const Icon = (props: IconWrapperProps) => {
  return (
    <IconWrapper {...props}>
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor">
        <path d="M118.979048 637.074286l137.99619 66.243047 255.171048 123.587048 246.076952-119.222857 147.163429-70.485334a73.142857 73.142857 0 0 1-34.230857 97.109334l-327.119239 158.427428a73.142857 73.142857 0 0 1-63.780571 0L153.136762 734.305524A73.142857 73.142857 0 0 1 118.979048 637.074286z m786.090666-153.063619a73.142857 73.142857 0 0 1-33.913904 97.767619L544.01219 740.205714a73.142857 73.142857 0 0 1-63.780571 0L153.136762 581.778286A73.142857 73.142857 0 0 1 117.51619 487.862857l362.300953 170.886095 32.329143 15.652572 327.119238-158.427429 65.80419-31.939047zM544.036571 139.190857l327.094858 158.403048a73.142857 73.142857 0 0 1 0 131.657143l-327.094858 158.427428a73.142857 73.142857 0 0 1-63.780571 0L153.136762 429.251048a73.142857 73.142857 0 0 1 0-131.657143L480.256 139.215238a73.142857 73.142857 0 0 1 63.780571 0z m-31.890285 65.828572L185.027048 363.422476l327.119238 158.427429 327.119238-158.427429L512.146286 205.04381z"></path>
      </svg>
    </IconWrapper>
  );
};

export default Icon;
