"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 라이브러리 import
import styles from "./playground.module.scss";
import ServiceItem from "@/components/ServiceItem/ServiceItem";
import { useRouter } from "next/navigation";
import SealionImg from "public/images/sealion.jpg";
import Image from "next/image";
import { LOCAL_URL } from "@/config";

export default function Playground() {
  const [services, setServices] = useState([]); // 서비스 데이터를 저장할 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true); // 데이터 요청 전 로딩 시작
      try {
        const response = await axios.get(`${LOCAL_URL}/services`);
        setServices(response.data);
        console.log("Services fetched successfully:", response.data);
      } catch (error) {
        console.error("There was an error fetching the services:", error);
      } finally {
        setLoading(false); // 데이터 요청 완료 후 로딩 종료
      }
    };

    fetchServices();
  }, []);
  const hasServices = services.length > 0;

  const serviceOnclickHandler = (serviceId) => {
    router.push(`/playground/${serviceId}`);
  };

  const LoadingUI = () => (
    <div className={styles.lodingContainer}>
      <div className={styles.laodingImageContainer}>
        <Image src={SealionImg} alt="Sealion" objectFit="cover" />
      </div>
      <h1>Loading...</h1>
    </div>
  );

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <LoadingUI /> // 로딩 중일 때 로딩 UI를 표시
      ) : (
        <>
          <div className={styles.titleContainer}>
            <div className={styles.titleWrap}>
              <div className={styles.title}>Products</div>
              <div className={styles.description}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </div>
            <div className={styles.btnWrap}>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
          </div>

          <div className={styles.servicesGrid}>
            {services.length > 0 ? (
              services.map((service, index) => (
                <ServiceItem
                  key={index}
                  service={service}
                  onClick={() => serviceOnclickHandler(service.uuid)}
                />
              ))
            ) : (
              <p className={styles.noServicesMessage}>No services available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
