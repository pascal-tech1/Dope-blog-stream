import type { RadioProps } from './radio.props';
declare const Styled: {
    Radio: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
    }, "className">;
    Input: import("styled-components").StyledComponent<"input", import("styled-components").DefaultTheme, {
        className: string;
        type: "radio";
    } & RadioProps, "type" | "className">;
};
export default Styled;
