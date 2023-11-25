import { ButtonSize } from '../../utils/types';
export var getIconSize = function getIconSize(sizeName) {
  switch (sizeName) {
    case ButtonSize.Xl:
      return 16;

    case ButtonSize.Lg:
    case ButtonSize.Md:
      return 14;

    case ButtonSize.Sm:
      return 12;

    case ButtonSize.Xs:
    default:
      return 11;
  }
};