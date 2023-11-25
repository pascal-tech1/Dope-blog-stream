import type { TooltipProps } from './tooltip.props';
declare const Styled: {
    Tooltip: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
        className: string;
    }, "className">;
    TooltipContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
        className: string;
    } & {
        open: boolean;
    } & TooltipProps, "className">;
};
export default Styled;
