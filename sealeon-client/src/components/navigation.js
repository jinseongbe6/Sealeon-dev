import styles from "./navigation.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SealeonFullLogo from "public/images/logo_full.png";
import { useWallet } from "@/wallets/wallet-selector";
import { ButtonBasic } from "@/components/Button/ButtonBasic";
import { useRouter } from "next/navigation";

export const Navigation = () => {
  const { signedAccountId, logOut, logIn } = useWallet();
  const [action, setAction] = useState(() => {});
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => logOut);
    } else {
      setAction(() => logIn);
    }
  }, [signedAccountId, logOut, logIn]);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      // 페이지가 최소 50px 이상 스크롤되었는지 확인
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // 아래로 스크롤할 때 네비게이션 바 숨김
        setShowNav(false);
      } else {
        // 위로 스크롤할 때 네비게이션 바 표시
        setShowNav(true);
      }
      // 마지막 스크롤 위치 업데이트
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={`${styles.mainContainer} ${showNav ? "" : styles.hide}`}>
      <div className={styles.leftContainer}>
        <Link href="/" passHref legacyBehavior>
          <Image
            priority
            src={SealeonFullLogo}
            alt="Sealion_logo"
            width={200}
            height={32.7}
          />
        </Link>
      </div>
      <div className={styles.rightContainer}>
        <Link href="/about" passHref className={styles.navLink}>
          About
        </Link>
        <Link href="/playground" passHref className={styles.navLink}>
          Playground
        </Link>
        <Link href="/provide-service" passHref className={styles.navLink}>
          Provide Service
        </Link>

        {signedAccountId !== "" && (
          <div onClick={action} className={styles.logout}>
            Logout
          </div>
        )}
        {signedAccountId !== "" ? (
          <ButtonBasic
            buttonText="My Page"
            onClick={() => router.push("/mypage")}
          />
        ) : (
          <ButtonBasic buttonText="Connect Wallet" onClick={action} />
        )}
      </div>
    </nav>
  );
};
