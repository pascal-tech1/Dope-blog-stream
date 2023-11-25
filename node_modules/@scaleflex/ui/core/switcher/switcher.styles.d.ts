import type { SwitcherProps } from './switcher.props';
declare const Styled: {
    Switcher: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
    }, "className">;
    Input: import("styled-components").StyledComponent<"input", import("styled-components").DefaultTheme, {
        className: string;
        type: "checkbox";
    } & SwitcherProps, "type" | "className">;
};
export default Styled;
