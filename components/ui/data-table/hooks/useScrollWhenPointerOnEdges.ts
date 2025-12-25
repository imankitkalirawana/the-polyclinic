import { MutableRefObject, PointerEvent, useCallback, useEffect, useRef } from 'react';

type UseScrollOnEdgeParams = {
  scrollContainerRef: MutableRefObject<Element | null>;
  enabled: boolean;
  scrollSpeed?: number;
  edgePadding?: number;
  shouldScrollHorizontal?: boolean;
};

export const useScrollWhenPointerOnEdges = ({
  scrollContainerRef,
  enabled,
  scrollSpeed = 30,
  edgePadding = 30,
  shouldScrollHorizontal = true,
}: UseScrollOnEdgeParams) => {
  const frameId = useRef<number | null>(null);

  /* TODO: Find a solution to use viewport (body) to calculate scroll boundaries */
  // const viewPortWidth = document.documentElement.clientWidth;
  // const viewPortHeight = document.documentElement.clientHeight;

  /**
   * Manually stop animation if enabled changes to false by any chance
   * and animation is still running
   */
  useEffect(() => {
    if (!enabled && frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
  }, [enabled]);

  // calculate the edges
  const pointerMoveHandler = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabled) return;

      const eventX = e.clientX;
      const eventY = e.clientY;

      if (!scrollContainerRef.current) return;
      const scrollContainerRect = scrollContainerRef.current?.getBoundingClientRect();

      const edgeTop = scrollContainerRect.top + edgePadding;
      const edgeLeft = scrollContainerRect.left + edgePadding;
      const edgeBottom = scrollContainerRect.bottom - edgePadding;
      const edgeRight = scrollContainerRect.right - edgePadding;

      // check if the current pointer position overlaps the edges
      const isInTopEdge = eventY < edgeTop;
      const isInLeftEdge = shouldScrollHorizontal && eventX < edgeLeft;
      const isInBottomEdge = eventY > edgeBottom;
      const isInRightEdge = shouldScrollHorizontal && eventX > edgeRight;

      const animateScrolling = () => {
        if (shouldScroll()) {
          frameId.current = null;
          startAnimation();
        } else {
          stopAnimation();
        }
      };

      const startAnimation = () => {
        // only start animation if there isn't already an animation in progress
        if (!frameId.current) {
          frameId.current = requestAnimationFrame(animateScrolling);
        }
      };

      const stopAnimation = () => {
        if (frameId.current) {
          cancelAnimationFrame(frameId.current);
          frameId.current = null;
        }
      };

      if (isInTopEdge || isInLeftEdge || isInBottomEdge || isInRightEdge) {
        startAnimation();
      } else {
        stopAnimation();
      }

      const maxScrollX =
        scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const maxScrollY =
        scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;

      const shouldScroll = () => {
        const currentScrollX = scrollContainerRef.current?.scrollLeft || 0;
        const currentScrollY = scrollContainerRef.current?.scrollTop || 0;

        const canScrollTop = currentScrollY > 0;
        const canScrollLeft = currentScrollX > 0;
        const canScrollBottom = currentScrollY < maxScrollY;
        const canScrollRight = currentScrollX < maxScrollX;

        let nextScrollX = currentScrollX;
        let nextScrollY = currentScrollY;

        if (isInTopEdge && canScrollTop) nextScrollY -= scrollSpeed;
        if (isInLeftEdge && canScrollLeft) nextScrollX -= scrollSpeed;
        if (isInBottomEdge && canScrollBottom) nextScrollY += scrollSpeed;
        if (isInRightEdge && canScrollRight) nextScrollX += scrollSpeed;

        // handle invalid maximums
        nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
        nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

        if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
          scrollContainerRef.current?.scrollTo(nextScrollX, nextScrollY);
          return true;
        }

        return false;
      };
    },
    [scrollContainerRef, edgePadding, scrollSpeed, enabled]
  );

  return { pointerMoveHandler };
};
