"use client";

import styles from "./success-page.module.scss";
import Image from "next/image";
import Link from "next/link";
import SealionImg from "public/images/sealion.jpg";
import { useWallet } from "@/wallets/wallet-selector";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCAL_URL } from "@/config";
import axios from "axios";

export default function SuccessPage() {
  const { signedAccountId, viewMethod, callMethodCustom } = useWallet();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryUuid = searchParams.get("uuid");
    if (queryUuid && signedAccountId) {
      // Async function to fetch data
      const fetchData = async () => {
        try {
          const response = await axios.get(`${LOCAL_URL}/hash/${queryUuid}`, {
            headers: {
              signedAccountId: signedAccountId,
            },
          });
          console.log("setSecretCode successfully:", response.data);
          localStorage.setItem("secretHash", response.data);
        } catch (error) {
          console.error("There was an error fetching the services:", error);
        }
      };
      fetchData();
    }
  }, [searchParams, signedAccountId]); // Add dependencies to useEffect

  return (
    <div className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <Image src={SealionImg} alt="Sealion" objectFit="cover" />
      </div>
      <h1>Success! Your Transaction is Complete.</h1>
      <br />
      <h1>
        Check {"  "} <Link href="/mypage">My Page</Link>
      </h1>
    </div>
  );
}
