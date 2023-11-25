import { css } from 'styled-components';
import { Color as PaletteColor } from '../../utils/types/palette';
export var errorMixin = function errorMixin(_ref) {
  var palette = _ref.theme.palette;
  return css(["background:", " !important;border:1px solid ", " !important;"], palette[PaletteColor.BackgroundSecondary], palette[PaletteColor.Error]);
};