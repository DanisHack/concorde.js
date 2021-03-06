/**
 * Browser module. Handy functions to retrieve information and capabilities from the browser.
 * @module Browser
 * @since 1.0.0
 */

import { Search } from './search';
import { compareVersion } from './version';

export default {
  /**
   * The object containing current browser information
   * @since 1.0.0
   * @member {Object} currentBrowser The object containing browser information.
   * @example
   *
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.currentBrowser
   * // => {
   * //   string: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
   * //   subString: 'Chrome',
   * //   identity: 'Chrome'
   * //}
   */
  get currentBrowser() {
    return Search.browser;
  },

  /**
   * The object containing current platform information
   * @since 1.0.0
   * @member {Object} currentPlatform The object containing platform information.
   * @example
   *
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.currentPlatform
   * // => { string: 'MacIntel', subString: 'Mac', identity: 'Mac' }
   */
  get currentPlatform() {
    return Search.platform;
  },

  /**
   * Determines the version of the current browser based on its userAgent string
   * @since 1.0.0
   * @member {Object} currentVersion The object containing platform information.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.currentVersion
   * // => [62, 0, 3202, 94]
   */
  get currentVersion() {
    return Search.version(this.currentBrowser);
  },

  /**
   * Determines the current browser identity (OS + Browser)
   * @since 1.0.0
   * @member {Object} identity The object containing OS + Browser information.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.identity
   * // => {
   * //   platform: 'Mac',
   * //   browser: 'Chrome',
   * //   version: '62.0.3202.94'
   * // }
   */
  get identity() {
    return {
      platform: this.currentPlatform.identity,
      browser: this.currentBrowser.identity,
      version: this.currentVersion.join
        ? this.currentVersion.join('.')
        : this.currentVersion,
    };
  },

  /**
   * Test if this document supports touch, however... There is much
   * discussion about detecting touch on Modernizr.
   * @see {@link https://github.com/Modernizr/Modernizr/issues/548|Modernizr}
   * @since 1.0.0
   * @member {boolean} supportsTouchEvents True if browser supports touch events. False otherwise.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.supportsTouchEvents
   * // => true
   */
  get supportsTouchEvents() {
    return (
      (this.isMobile || this.isTablet) &&
      ('ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch))
    );
  },

  /**
   * Test if this device is mobile, based on its userAgent string.
   * @since 1.0.0
   * @member {boolean} isMobile True if browser is mobile. False otherwise.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.isMobile
   * // => true
   */
  get isMobile() {
    return !!/Android|CriOS|FxiOS|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  /**
   * Test if this device is an iPhone, based on its userAgent string.
   * @since 1.0.0
   * @member {boolean} isIphone True if browser is an iPhone. False otherwise.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.isIphone
   * // => true
   */
  get isIphone() {
    return /iPhone/.test(navigator.platform);
  },

  /**
   * Test if this device is an Android, based on its userAgent string.
   * @since 1.6.0
   * @member {boolean} isAndroid True if browser is an Android. False otherwise.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.isAndroid
   * // => true
   */
  get isAndroid() {
    return /Android/.test(navigator.userAgent);
  },

  /**
   * Test if this device is an iPad, based on its userAgent string.
   * @since 1.0.0
   * @member {boolean} isTablet True if browser is an iPad. False otherwise.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.isTablet
   * // => true
   */
  get isTablet() {
    return /iPad/i.test(navigator.userAgent);
  },

  /**
   * Determines if the provided browser(s) matches the actual browser.
   * @since 1.0.0
   * @function oneOf
   * @param {Array|String} browsers A browser or list of browsers, with version check condition.
   * @returns {boolean} True if the actual browser matches some of the browser on the list.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.oneOf([
   *   'explorer >= 9.0',
   *   'chrome >= 43',
   *   'firefox >= 42',
   *   'safari >= 5'
   * ]);
   * // => true
   *
   * Browser.oneOf('explorer < 6');
   * // => false
   */
  oneOf(lines = []) {
    if (typeof lines === 'string') {
      lines = [lines];
    }

    return lines.filter((line) => this.matches(line)).length > 0;
  },

  /**
   * Determines if the provided platform matches the actual platform.
   * @since 1.0.0
   * @function platform
   * @param {String} query Platform identifier.
   * @returns {boolean} True if the actual platform matches the provided identifier.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.plaform('mac');
   * // => true
   *
   * Browser.plaform('windows');
   * // => false
   */
  platform(query = null) {
    return this.currentPlatform.identity
      .toLowerCase()
      .includes(`${query}`.toLowerCase());
  },

  /**
   * Determines if the actual browser is not part of the provided browser or list of browsers.
   * @since 1.0.0
   * @function isOutdated
   * @param {Array|String} supportedBrowsers A browser or list of supported browsers, with version check condition.
   * @returns {boolean} True if the actual browser does not match some of the browser on the list.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.isOutdated([
   *   'explorer >= 9.0',
   *   'chrome >= 43',
   *   'firefox >= 42',
   *   'safari >= 5'
   * ]);
   * // => false
   *
   * Browser.isOutdated('explorer < 6');
   * // => true
   */
  isOutdated(supportedBrowsers) {
    return !this.oneOf(supportedBrowsers);
  },

  /**
   * Determines if the actual browser matches the provided browser and version.
   * @since 1.0.0
   * @function matches
   * @param {String} query A browser identifier, with version check condition.
   * @returns {boolean} True if the actual browser does match the provided query.
   * @example
   * import Browser from '@wetransfer/concorde-browser';
   *
   * Browser.matches('chrome >= 43');
   * // => true
   *
   * Browser.matches('explorer < 6');
   * // => false
   */
  matches(query) {
    const result = query.split(/\s+/);

    const browser = result[0];

    // does it match the browser?
    if (
      !this.currentBrowser.identity
        .toLowerCase()
        .includes(`${browser}`.toLowerCase())
    ) {
      return false;
    }

    // No other params? Then it is finished and succesful
    if (result.length <= 1) {
      return true;
    }

    // expand the query
    const operator = result[1];
    const version = result[2];

    // Compare the versions
    return compareVersion(this.currentVersion, operator, version);
  },
};
