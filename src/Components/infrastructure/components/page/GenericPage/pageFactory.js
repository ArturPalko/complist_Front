import { compose } from "redux";

import GenericPage from "./GenericPage";

import withDataLoaderForMenu from "../../../../../redux/hocs/withDataLoader";
import withToggleElements from "../../../../../redux/hocs/withToggleElements";
import { getDataByMenu } from '../../../../../redux/reducers/data-reducer/data-reducer';


/**
 * Фабрика сторінок
 * @param {string} menu - ключ меню (Pages.*)
 */
export const createPage = (menu) =>
  compose(
    withDataLoaderForMenu(menu, getDataByMenu),
    withToggleElements(menu)
  )(function PageWrapper(props) {
    return <GenericPage {...props} pageName={menu} />;
  });
