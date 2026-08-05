import { compose } from "redux";

import GenericPage from "./GenericPage";

import withDataLoaderForMenu from "../../../../redux/hocs/withDataLoader";
import withToggleElements from "../../../../redux/hocs/withToggleElements";
import { getDataByMenu } from "../../../../redux/reducers/data-reducer/data-reducer";

/**
 * Базова сторінка (без DataLoader)
 */
export const createPageBase = (menu) =>
  compose(
    withToggleElements(menu)
  )(function PageWrapper(props) {
    return <GenericPage {...props} pageName={menu} />;
  });

/**
 * Сторінка з автоматичним завантаженням даних
 */
export const createPage = (menu) =>
  compose(
    withDataLoaderForMenu(menu, getDataByMenu)
  )(createPageBase(menu));