import { LitElement, css, unsafeCSS, html, PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAsync
} from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../prompt-card/prompt-card';

// Types
import type { PromptDataRemote } from '../../types/promptlet';

// Assets
import componentCSS from './panel-community.css?inline';
import expandIcon from '../../images/icon-more-circle.svg?raw';
import shrinkIcon from '../../images/icon-shrink.svg?raw';
import crossIcon from '../../images/icon-cross.svg?raw';

import fakePromptsJSON from '../../data/fake-prompts-100.json';

const fakePrompts = fakePromptsJSON as PromptDataRemote[];

/**
 * Panel community element.
 *
 */
@customElement('promptlet-panel-community')
export class PromptLetPanelCommunity extends LitElement {
  //==========================================================================||
  //                              Class Properties                            ||
  //==========================================================================||
  @state()
  curMode: 'popular' | 'new' = 'popular';

  @state()
  popularTags: string[] = [];

  @state()
  maxTagsOneLine = 3;

  @state()
  isPopularTagListExpanded = false;

  @state()
  curSelectedTag = '';

  @query('.popular-tags')
  popularTagsElement: HTMLElement | undefined;

  @query('.panel-community')
  panelElement: HTMLElement | undefined;

  //==========================================================================||
  //                             Lifecycle Methods                            ||
  //==========================================================================||
  constructor() {
    super();
    this.popularTags = [
      'writing',
      'research',
      'science',
      'technology',
      'art',
      'music',
      'history',
      'literature',
      'mathematics',
      'programming',
      'design',
      'photography',
      'biology',
      'chemistry',
      'physics',
      'psychology',
      'philosophy',
      'business',
      'economics',
      'politics',
      'environment',
      'health',
      'fitness',
      'food',
      'travel',
      'sports',
      'fashion',
      'culture',
      'education',
      'language'
    ];
  }

  /**
   * This method is called before new DOM is updated and rendered
   * @param changedProperties Property that has been changed
   */
  willUpdate(changedProperties: PropertyValues<this>) {}

  firstUpdated() {
    this.initMaxTagsOneLine();
  }

  //==========================================================================||
  //                              Custom Methods                              ||
  //==========================================================================||
  async initData() {}

  /**
   * Determine how many popular tags to show so that the tags element has only one line
   */
  initMaxTagsOneLine() {
    if (!this.popularTagsElement || !this.panelElement) {
      throw Error('A queried element is not initialized.');
    }

    const tagsBBox = this.popularTagsElement.getBoundingClientRect();
    const tempTags = document.createElement('div');
    this.panelElement.appendChild(tempTags);

    tempTags.style.setProperty('visibility', 'hidden');
    tempTags.style.setProperty('position', 'absolute');
    tempTags.style.setProperty('width', `${tagsBBox.width}px`);
    tempTags.classList.add('popular-tags');

    const specialTag = document.createElement('span');
    specialTag.classList.add('tag', 'expand-tag');
    specialTag.innerHTML = `
    <span class="svg-icon"
        >${this.isPopularTagListExpanded ? shrinkIcon : expandIcon}</span
      >
    more`;
    tempTags.appendChild(specialTag);

    const initHeight = tempTags.getBoundingClientRect().height;

    for (let i = 0; i < this.popularTags.length; i++) {
      const curTag = document.createElement('tag');
      curTag.classList.add('tag');
      curTag.innerText = this.popularTags[i];
      tempTags.appendChild(curTag);
      const curHeight = tempTags.getBoundingClientRect().height;
      if (curHeight > initHeight) {
        if (this.maxTagsOneLine !== i) {
          this.maxTagsOneLine = i;
        }
        break;
      }
    }

    tempTags.remove();
  }

  //==========================================================================||
  //                              Event Handlers                              ||
  //==========================================================================||
  popularTagListToggled() {
    this.isPopularTagListExpanded = !this.isPopularTagListExpanded;
  }

  tagClicked(tag: string) {
    if (this.curSelectedTag === tag) {
      this.curSelectedTag = '';
    } else {
      this.curSelectedTag = tag;
    }
  }

  //==========================================================================||
  //                             Private Helpers                              ||
  //==========================================================================||

  //==========================================================================||
  //                           Templates and Styles                           ||
  //==========================================================================||
  render() {
    // Create the tag list
    let popularTagList = html``;
    const curMaxTag = this.isPopularTagListExpanded
      ? this.popularTags.length
      : this.maxTagsOneLine;

    for (const tag of this.popularTags.slice(0, curMaxTag)) {
      popularTagList = html`${popularTagList}
        <span
          class="tag"
          ?is-selected="${this.curSelectedTag === tag}"
          @click=${() => this.tagClicked(tag)}
          >${tag}</span
        >`;
    }

    const specialTag = html`<span
      class="tag expand-tag"
      @click=${() => {
        this.popularTagListToggled();
      }}
      ><span class="svg-icon"
        >${unsafeHTML(
          this.isPopularTagListExpanded ? shrinkIcon : expandIcon
        )}</span
      >
      ${this.isPopularTagListExpanded ? 'less' : 'more'}</span
    >`;

    return html`
      <div class="panel-community">
        <div class="header">
          <div class="header-top">
            <span class="name">205 Prompts</span>
            <span class="filter" ?is-hidden=${this.curSelectedTag === ''}
              >tagged
              <span
                class="tag"
                is-selected=""
                @click=${() => this.tagClicked(this.curSelectedTag)}
                >${this.curSelectedTag}
                <span class="svg-icon">${unsafeHTML(crossIcon)}</span>
              </span></span
            >
            <div class="header-toggle">
              <span
                @click=${() => {
                  this.curMode = 'popular';
                }}
                ?is-active=${this.curMode === 'popular'}
                >Popular</span
              >
              <span
                @click=${() => {
                  this.curMode = 'new';
                }}
                ?is-active=${this.curMode === 'new'}
                >New</span
              >
            </div>
          </div>
          <div class="header-bottom">
            <div class="header-tag-list">
              <span class="name">Popular tags</span>
              <div class="popular-tags">${popularTagList} ${specialTag}</div>
            </div>
          </div>
        </div>

        <div class="prompt-container">
          <promptlet-prompt-card
            .promptData=${fakePrompts[0]}
          ></promptlet-prompt-card>

          <promptlet-prompt-card
            .promptData=${fakePrompts[1]}
          ></promptlet-prompt-card>
        </div>
      </div>
    `;
  }

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'promptlet-panel-community': PromptLetPanelCommunity;
  }
}