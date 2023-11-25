import React from 'react';
import PT from 'prop-types';
import type { TextareaProps } from './textarea.props';
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export declare const propTypes: {
    error: PT.Requireable<boolean>;
    value: PT.Requireable<string>;
    background: PT.Requireable<"primary" | "secondary">;
};
export default Textarea;
