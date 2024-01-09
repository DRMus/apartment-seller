import React, { forwardRef } from "react";

interface SvgProps extends React.SVGProps<SVGSVGElement> {}

const Svg = forwardRef<SVGSVGElement, SvgProps>(
  ({ xmlns, children, ...props }, ref) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
        {children}
      </svg>
    );
  }
);

export default Svg;
