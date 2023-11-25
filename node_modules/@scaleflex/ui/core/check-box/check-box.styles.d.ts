import type { CheckBoxProps } from './check-box.props';
declare const Styled: {
    CheckBox: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
    } & CheckBoxProps, "className">;
    Input: import("styled-components").StyledComponent<"input", import("styled-components").DefaultTheme, {
        className: string;
        type: "checkbox";
    } & CheckBoxProps, "type" | "className">;
};
export default Styled;
