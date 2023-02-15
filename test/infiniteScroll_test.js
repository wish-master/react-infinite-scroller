import React from 'react';
import { render, act } from '@testing-library/react';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { InfiniteScroll } from '../src/InfiniteScroll';

describe('InfiniteScroll component', () => {
  it('should render', () => {
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );

    const { container } = render(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(container.querySelectorAll('.child-class').length).to.equal(3);
  });

  it('should render componentDidMount', () => {
    spy(InfiniteScroll.prototype, 'componentDidMount');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    render(
      <div>
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={false}>
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(InfiniteScroll.prototype.componentDidMount.callCount).to.equal(1);
    InfiniteScroll.prototype.componentDidMount.restore();
  });

  it('should attach scroll listeners', () => {
    spy(InfiniteScroll.prototype, 'attachScrollListener');
    spy(InfiniteScroll.prototype, 'scrollListener');
    const loadMore = stub();
    const children = (
      <div>
        <div className="child-class">1</div>
        <div className="child-class">2</div>
        <div className="child-class">3</div>
      </div>
    );
    render(
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore
          useWindow={false}
          threshold={0}
        >
          <div className="om-product__list">{children}</div>
        </InfiniteScroll>
      </div>
    );
    expect(InfiniteScroll.prototype.attachScrollListener.callCount).to.equal(1);
    expect(InfiniteScroll.prototype.scrollListener.callCount).to.equal(1);
    InfiniteScroll.prototype.attachScrollListener.restore();
    InfiniteScroll.prototype.scrollListener.restore();
  });

  it('should handle when the scrollElement is removed from the DOM', () => {
    const componentRef = React.createRef();

    const loadMore = stub();

    const { container } = render(
      <div>
        <InfiniteScroll
          ref={componentRef}
          pageStart={0}
          loadMore={loadMore}
          hasMore={false}
        >
          <div className="child-component">Child Text</div>
        </InfiniteScroll>
      </div>
    );

    // The component has now mounted, but the scrollComponent is null
    componentRef.current.scrollComponent = null;

    // Invoke the scroll listener which depends on the scrollComponent to
    // verify it executes properly, and safely navigates when the
    // scrollComponent is null.
    componentRef.current.scrollListener();

    expect(container.textContent).to.equal('Child Text');
  });
});
