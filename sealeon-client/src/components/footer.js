import styles from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SealeonFullLogo from "public/images/logo_full.png";
import { useWallet } from "@/wallets/wallet-selector";

export const Footer = () => {
  const { signedAccountId, logOut, logIn } = useWallet();
  const [action, setAction] = useState(() => {});

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => logOut);
    } else {
      setAction(() => logIn);
    }
  }, [signedAccountId, logOut, logIn, setAction]);

  return (
    <nav className={styles.mainContainer}>
      <div className={styles.topContainer}>
        <Link className={styles.logo} href="/" passHref legacyBehavior>
          <Image
            priority
            src={SealeonFullLogo}
            alt="Sealion_logo"
            width={200}
            height={32.7}
          />
        </Link>

        <div className={styles.linkContainer}>
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
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.infoContainer}>
          <div>© 2024 Sealeon. All rights reserved.</div>
          <div className={styles.wrapper}>
            <div>Privacy Policy</div>
            <div>Terms of Service</div>
            <div>Cookies Settings</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
