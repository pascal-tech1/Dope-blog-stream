import type { TagProps } from './tag.props';
declare const Styled: {
    Tag: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
        className: string;
    } & TagProps & {
        hasRemoveHandler: boolean;
    }, "className">;
    Label: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
    }, "className">;
    Cross: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
    }, "className">;
};
export default Styled;
