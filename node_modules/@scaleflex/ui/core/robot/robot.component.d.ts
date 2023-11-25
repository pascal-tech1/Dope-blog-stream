import React from 'react';
import PT from 'prop-types';
import type { RobotProps } from './robot.props';
declare const Robot: React.ForwardRefExoticComponent<RobotProps & React.RefAttributes<HTMLSpanElement>>;
export declare const defaultProps: {
    status: "happy";
};
export declare const propTypes: {
    status: PT.Requireable<"happy" | "neutral" | "sad" | "worried">;
};
export default Robot;
