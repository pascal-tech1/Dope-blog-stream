import type { WithTheme } from '../../theme/entity';
export declare const tabSizeMixin: {
    md: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    lg: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
};
export declare const iconSizeMixin: {
    md: import("styled-components").FlattenSimpleInterpolation;
    lg: import("styled-components").FlattenSimpleInterpolation;
};
