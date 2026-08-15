"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { MenuButton } from "@/app/_components/menu-button";
import { categories } from "@/lib/categories";
import { siteLogoPath, siteName } from "@/lib/site";

import styles from "./site-header.module.scss";

const headerHideStart = 160;
const stickyStart = 76;
const scrollThreshold = 8;

export function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const scrollAnchorRef = useRef(0);
  const shellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const shell = shellRef.current;
    if (!header || !shell) return;

    const updateShellHeight = () => {
      if (window.scrollY <= stickyStart) {
        shell.style.blockSize = `${header.offsetHeight}px`;
      }
    };
    const observer = new ResizeObserver(updateShellHeight);
    observer.observe(header);
    updateShellHeight();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame !== 0) return;

      frame = requestAnimationFrame(() => {
        const currentScroll = Math.max(window.scrollY, 0);
        if (currentScroll <= stickyStart) {
          setIsCompact(false);
          setIsVisible(true);
          scrollAnchorRef.current = currentScroll;
          frame = 0;
          return;
        }

        setIsCompact(true);
        if (currentScroll <= headerHideStart) {
          setIsVisible(true);
          scrollAnchorRef.current = currentScroll;
          frame = 0;
          return;
        }

        if (isSearchOpen) {
          setIsVisible(true);
          scrollAnchorRef.current = currentScroll;
          frame = 0;
          return;
        }

        const scrollDifference = currentScroll - scrollAnchorRef.current;
        if (Math.abs(scrollDifference) >= scrollThreshold) {
          setIsVisible(scrollDifference < 0);
          scrollAnchorRef.current = currentScroll;
        }
        frame = 0;
      });
    };

    scrollAnchorRef.current = Math.max(window.scrollY, 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [isSearchOpen]);

  const handleSearchToggle = (trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    if (isSearchOpen) {
      setIsSearchOpen(false);
      return;
    }

    setIsSearchOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 260);
  };
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !isSearchOpen) return;
    setIsSearchOpen(false);
    lastTriggerRef.current?.focus();
  };

  return (
    <div
      className={styles.shell}
      data-compact={isCompact}
      data-visible={isVisible}
      ref={shellRef}
      onFocusCapture={() => setIsVisible(true)}
      onKeyDown={handleSearchKeyDown}
    >
      <a className={styles.skipLink} href="#main-content">
        本文へ移動
      </a>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.top}>
          <Link className={styles.logo} href="/">
            <Image
              src={siteLogoPath}
              alt={siteName}
              width={1808}
              height={191}
            />
          </Link>
          <div className={styles.actions}>
            <button
              className={styles.search}
              type="button"
              aria-label={isSearchOpen ? "記事検索を閉じる" : "記事検索を開く"}
              aria-controls="header-search"
              aria-expanded={isSearchOpen}
              onClick={(event) => handleSearchToggle(event.currentTarget)}
            >
              {isSearchOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Search aria-hidden="true" />
              )}
            </button>
            <MenuButton />
          </div>
        </div>
        <div
          className={styles.searchDisclosure}
          id="header-search"
          data-open={isSearchOpen}
          aria-hidden={!isSearchOpen}
        >
          <div className={styles.searchInner} inert={!isSearchOpen}>
            <form action="/search/" method="get" role="search">
              <label htmlFor="header-article-search">記事を検索</label>
              <div className={styles.searchField}>
                <input
                  id="header-article-search"
                  ref={inputRef}
                  name="q"
                  type="search"
                  enterKeyHint="search"
                  placeholder="例: Next.js、SCSS、デザイン"
                />
                <button type="submit" aria-label="記事を検索">
                  <Search aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <nav
          className={styles.categories}
          aria-label="カテゴリー"
          inert={isCompact}
        >
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <Link href={`/search/?q=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  );
}
