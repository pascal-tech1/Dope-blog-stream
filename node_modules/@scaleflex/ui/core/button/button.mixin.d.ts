import type { WithTheme } from '../../theme/entity';
export declare const colorButtonMixin: {
    primary: ({ theme: { palette } }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    secondary: ({ theme: { palette } }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    link: ({ theme: { palette } }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    error: ({ theme: { palette } }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
};
export declare const sizeButtonMixin: {
    xs: import("styled-components").FlattenSimpleInterpolation;
    sm: import("styled-components").FlattenSimpleInterpolation;
    md: import("styled-components").FlattenSimpleInterpolation;
    lg: import("styled-components").FlattenSimpleInterpolation;
    xl: import("styled-components").FlattenSimpleInterpolation;
};
export declare const sizeButtonLabelMixin: {
    xs: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    sm: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    md: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    lg: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
    xl: ({ theme: { typography: { font }, }, }: WithTheme) => import("styled-components").FlattenSimpleInterpolation;
};
