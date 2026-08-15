import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { useState } from "react";

import styles from "./menu-button.module.scss";

export function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogId = "site-menu";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const handleOpen = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };
  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) dialogRef.current.close();
  };
  const handleLink = () => dialogRef.current?.close();

  return (
    <>
      <button
        className={styles.trigger}
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        aria-label="メニューを開く"
        onClick={handleOpen}
      >
        <Menu aria-hidden="true" />
      </button>
      <dialog
        className={styles.dialog}
        id={dialogId}
        ref={dialogRef}
        aria-labelledby="menu-title"
        onClick={handleBackdrop}
      >
        <div className={styles.panel}>
          <div className={styles.heading}>
            <span id="menu-title">Menu</span>
            <form method="dialog">
              <button
                className={styles.close}
                type="submit"
                aria-label="閉じる"
              >
                <X aria-hidden="true" />
              </button>
            </form>
          </div>
          <nav aria-label="サイトメニュー">
            <ul className={styles.links}>
              <li>
                <Link href="/#latest" onClick={handleLink}>
                  新着記事
                </Link>
              </li>
              <li>
                <Link href="/search/" onClick={handleLink}>
                  記事を検索
                </Link>
              </li>
              <li>
                <Link href="/#about" onClick={handleLink}>
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
