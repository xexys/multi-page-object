import type {RootElementMapper} from '../types';
import {getByHasSelector} from './getByHasSelector';

/**
 * Маппер для поиска первого элемента, внутри которого есть другой элемент, содержащий атрибут `data-e2e-i18n-key="${i18nKey}"`.
 *
 * @example
 *  class ButtonPO extends MultiPageObject {
 *      static rootSelector = 'button';
 *  }
 *
 *  class FooPO extends MultiPageObject {
 *      static rootSelector = '.foo';
 *
 *      // Это равносильно поиску по селектору '.foo button:has([data-e2e-i18n-key="common.price-warning-modal:cancel-button"])'.
 *      get cancelButton() {
 *          return this._getPageObject(ButtonPO, getByI18nKey('common.price-warning-modal:cancel-button'))
 *      }
 *  }
 */
export const getByI18nKey = (i18nKey: string): RootElementMapper => {
    return getByHasSelector(`[data-e2e-i18n-key="${i18nKey}"]`);
};
