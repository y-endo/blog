"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import type { Post } from "@/lib/post";
import { formatPublishedAt, postImageSize } from "@/lib/post";

import styles from "./hero-carousel.module.scss";

type HeroCarouselProps = Readonly<{
  posts: readonly Post[];
}>;

const navigationInterval = 300;

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const autoplay = useMemo(
    () =>
      Autoplay({
        active: posts.length > 1,
        delay: 6000,
        stopOnFocusIn: true,
        stopOnInteraction: false,
      }),
    [posts.length],
  );
  const [carouselRef, carouselApi] = useEmblaCarousel(
    {
      align: "center",
      duration: 25,
      loop: posts.length > 1,
      watchDrag: posts.length > 1,
    },
    [autoplay],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(posts.length > 1);
  const isNavigationLockedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };
    const handlePointerDown = () => setIsDragging(true);
    const handlePointerUp = () => setIsDragging(false);

    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);
    carouselApi.on("pointerDown", handlePointerDown);
    carouselApi.on("pointerUp", handlePointerUp);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
      carouselApi.off("pointerDown", handlePointerDown);
      carouselApi.off("pointerUp", handlePointerUp);
    };
  }, [carouselApi]);

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotion = () => {
      reducedMotionRef.current = reducedMotion.matches;
      if (reducedMotion.matches && carouselApi) {
        autoplay.stop();
        setIsPlaying(false);
      }
    };

    handleReducedMotion();
    reducedMotion.addEventListener("change", handleReducedMotion);

    return () =>
      reducedMotion.removeEventListener("change", handleReducedMotion);
  }, [autoplay, carouselApi]);

  const resetAutoplay = () => {
    if (autoplay.isPlaying()) autoplay.reset();
  };
  const canNavigate = () => {
    if (reducedMotionRef.current) return true;
    if (isNavigationLockedRef.current) return false;

    isNavigationLockedRef.current = true;
    window.setTimeout(() => {
      isNavigationLockedRef.current = false;
    }, navigationInterval);
    return true;
  };
  const showPrevious = () => {
    if (!carouselApi || !canNavigate()) return;
    carouselApi.scrollPrev(reducedMotionRef.current);
    resetAutoplay();
  };
  const showNext = () => {
    if (!carouselApi || !canNavigate()) return;
    carouselApi.scrollNext(reducedMotionRef.current);
    resetAutoplay();
  };
  const showSlide = (index: number) => {
    if (
      !carouselApi ||
      index === carouselApi.selectedScrollSnap() ||
      !canNavigate()
    )
      return;
    carouselApi.scrollTo(index, reducedMotionRef.current);
    resetAutoplay();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  };
  const handlePlayback = () => {
    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play(reducedMotionRef.current);
      setIsPlaying(true);
    }
  };

  return (
    <section
      className={styles.carousel}
      aria-label="注目の記事"
      aria-roledescription="カルーセル"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${styles.viewport} ${isDragging ? styles.isDragging : ""}`}
        ref={carouselRef}
      >
        <ul className={styles.track} role="list">
          {posts.map((post, index) => {
            const isActive = index === activeIndex;

            return (
              <li
                className={styles.slide}
                key={post.slug}
                aria-hidden={!isActive}
              >
                <div className={styles.media} aria-hidden="true">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      {...postImageSize}
                      sizes="(min-width: 1024px) 40vw, 76vw"
                      loading="eager"
                      preload={index === 0}
                      draggable={false}
                    />
                  ) : null}
                </div>
                <div className={styles.copy}>
                  <div className={styles.eyebrow}>
                    <Link
                      className={styles.category}
                      href={`/search/?q=${encodeURIComponent(post.category)}`}
                      tabIndex={isActive ? undefined : -1}
                    >
                      {post.category}
                    </Link>
                    <time className={styles.date} dateTime={post.publishedAt}>
                      {formatPublishedAt(post.publishedAt)}
                    </time>
                  </div>
                  <h2>
                    <Link
                      className={styles.titleLink}
                      href={`/posts/${post.slug}/`}
                      tabIndex={isActive ? undefined : -1}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p>{post.description}</p>
                  <ul className={styles.tags} aria-label="タグ">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/search/?q=${encodeURIComponent(tag)}`}
                          tabIndex={isActive ? undefined : -1}
                        >
                          # {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        className={styles.previous}
        type="button"
        aria-label="前の注目記事"
        onClick={showPrevious}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        className={styles.next}
        type="button"
        aria-label="次の注目記事"
        onClick={showNext}
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <div className={styles.controls}>
        <div className={styles.dots} role="group" aria-label="注目記事を選択">
          {posts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              aria-label={`${post.title}を表示`}
              aria-current={index === activeIndex}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <button
          className={styles.playback}
          type="button"
          aria-label={isPlaying ? "自動再生を一時停止" : "自動再生を開始"}
          onClick={handlePlayback}
        >
          {isPlaying ? (
            <Pause aria-hidden="true" />
          ) : (
            <Play aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
