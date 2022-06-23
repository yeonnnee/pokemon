import { MutableRefObject, useCallback, useEffect, useState } from "react";




function useInfinitScroll(target: MutableRefObject<HTMLDivElement | null>, loadMoreData:() => void) {

  // 무한 스크롤 : 스크롤 하단 위치시 데이터 추가 로드
  const checkIntersect = useCallback(async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (!entry.isIntersecting) return;
    loadMoreData();
  }, [loadMoreData]);

  // Intersection Observer API
  useEffect(() => {
    const observer = new IntersectionObserver(checkIntersect, { threshold: 1 });
    if (target.current) observer.observe(target.current);
    return () => observer && observer.disconnect();
  }, [checkIntersect, target]);
  
  return
}

export default useInfinitScroll;