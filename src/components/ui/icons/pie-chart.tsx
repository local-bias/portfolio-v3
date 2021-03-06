import React, { FC } from 'react';

const Component: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg x='0px' y='0px' viewBox='0 0 512 512' fill='currentColor' {...props}>
    <g>
      <path d='M284.344,0v225.203l211.641-77.031C464.453,61.813,381.484,0,284.344,0z'></path>
      <path
        d='M241.219,286.781V61.578C117.047,61.563,16.016,162.594,16.016,286.781c0,27.063,4.797,52.984,13.578,77.031
		C61.125,450.172,144.078,512,241.219,512c124.188,0,225.219-101.031,225.219-225.219c0-27.031-4.797-52.984-13.578-77.031
		L241.219,286.781z'
      ></path>
    </g>
  </svg>
);

export const PieChartIcon = Component;
