"use client";

import styles from "./about/about.module.scss";
import Image from "next/image";
import SealionImg from "public/images/sealion02.jpg";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <Image src={SealionImg} alt="Sealion" objectFit="cover" />
      </div>
      <h1>Home Page Coming Soon!</h1>
    </div>
  );
}
