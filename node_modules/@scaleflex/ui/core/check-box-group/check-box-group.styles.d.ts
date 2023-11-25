import type { CheckBoxGroupProps } from './check-box-group.props';
import { LabelPositionType } from './check-box-group.props';
declare const Styled: {
    CheckBoxGroup: import("styled-components").StyledComponent<"label", import("styled-components").DefaultTheme, {
        className: string;
    } & CheckBoxGroupProps, "className">;
    Label: import("styled-components").StyledComponent<"span", import("styled-components").DefaultTheme, {
        className: string;
        type: string;
    } & {
        labelPosition: LabelPositionType | undefined;
        disabled: boolean;
    }, "type" | "className">;
};
export default Styled;
