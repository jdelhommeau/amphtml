/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {getAmpAdRenderOutsideViewport} from '../concurrent-load';
import {createElementWithAttributes} from '../../../../src/dom';

describes.realWin('concurrent-load', {}, env => {

  it('getAmpAdRenderOutsideViewport should return null if ' +
      'data-loading-strategy attribute does not exist', () => {
    const element = env.win.document.createElement('amp-ad');
    expect(getAmpAdRenderOutsideViewport(element)).to.be.null;
  });

  it('getAmpAdRenderOutsideViewport should respect ' +
      'data-loading-strategy attribute', () => {
    // data-loading-strategy=prefer-viewability-over-views is 1.25
    verifyGetAmpAdRenderOutsideViewport('prefer-viewability-over-views', 1.25);
    // data-loading-strategy attribute with no value is 1.25
    verifyGetAmpAdRenderOutsideViewport('', 1.25);

    verifyGetAmpAdRenderOutsideViewport('0', 0);
    verifyGetAmpAdRenderOutsideViewport('0.256', 0.256);
    verifyGetAmpAdRenderOutsideViewport('1.25', 1.25);
    verifyGetAmpAdRenderOutsideViewport('3.0', 3);

    expectGetAmpAdRenderOutsideViewportThrow('3.1');
    expectGetAmpAdRenderOutsideViewportThrow('-0.1');
    expectGetAmpAdRenderOutsideViewportThrow('invalid-value');
  });

  function verifyGetAmpAdRenderOutsideViewport(loadingStrategy, viewportNum) {
    const element = createElementWithAttributes(env.win.document, 'amp-ad', {
      'data-loading-strategy': loadingStrategy,
    });
    expect(getAmpAdRenderOutsideViewport(element)).to.equal(viewportNum);
  }

  function expectGetAmpAdRenderOutsideViewportThrow(loadingStrategy) {
    const element = createElementWithAttributes(env.win.document, 'amp-ad', {
      'data-loading-strategy': loadingStrategy,
    });
    expect(() => getAmpAdRenderOutsideViewport(element)).to.throw();
  }
});
