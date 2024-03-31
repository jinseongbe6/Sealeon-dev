"use client";

import styles from "./about.module.scss";
import Image from "next/image";
import SealionImg from "public/images/sealion.jpg";

export default function About() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <Image src={SealionImg} alt="Sealion" objectFit="cover" />
      </div>
      <h1>About Page Coming Soon!</h1>
    </div>
  );
}
