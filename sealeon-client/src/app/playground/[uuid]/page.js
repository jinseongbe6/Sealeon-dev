"use client";

import styles from "./service-detail.module.scss";
import { useState, useEffect } from "react";
import { ButtonBasic } from "@/components/Button/ButtonBasic";
import { SEALEON_CONTRACK } from "@/config";
import { useWallet } from "@/wallets/wallet-selector";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import Simbol from "public/images/simbol_square.png";
import SealionImg from "public/images/sealion03.png";
import { LOCAL_URL } from "@/config";

const LoadingUI = () => (
  <div className={styles.lodingContainer}>
    <div className={styles.laodingImageContainer}>
      <Image src={SealionImg} alt="Sealion" objectFit="cover" />
    </div>
    <h1>Loading...</h1>
  </div>
);

export default function Playground({ params }) {
  const { callMethodCustom } = useWallet();
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리 추가

  const removeBrackets = (str) => {
    return str.replace(/[\[\]"']|"\s|"\s"/g, "");
  };

  const cleanTags = (tagsArray) => {
    if (!tagsArray) {
      return [];
    }

    return tagsArray.map((tag) => removeBrackets(tag));
  };

  if (!service) {
    return <div>Loading...</div>;
  }

  const {
    serviceName,
    id,
    end_timestamp,
    serviceDescription,
    serviceLongDescription,
    price_per_minute_mantissa,
    screenshot,
    tags: beforeTags,
  } = service;

  const tags = cleanTags(beforeTags);

  const [time, setTime] = useState(1);

  const calculateMaxHours = (endTimestamp) => {
    const currentTime = new Date(); // 현재 시간
    const endTime = new Date(endTimestamp / 1000000); // 나노세컨드를 밀리컨드로 변환하여 Date 객체 생성
    const timeDiff = endTime - currentTime; // 밀리초 단위의 차이
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // 시간 단위로 변환 후 내림
    return Math.max(hoursDiff, 1); // 최소 1시간은 선택할 수 있도록 합니다.
  };

  const maxHours = calculateMaxHours(end_timestamp);

  const basePricePerHour = (price_per_minute_mantissa * 60) / Math.pow(10, 24);

  const handleSliderChange = (e) => {
    setTime(e.target.value);
  };

  const totalPrice = Number(time * basePricePerHour);

  const onClickPurchaseButton = async (serviceId, hour, basePricePerHour) => {
    const usageMinute = Math.round(Number(hour) * 60).toString();
    const totalPrice = ethers.utils
      .parseUnits(Math.round(hour * basePricePerHour * 10 ** 10).toString(), 14)
      .toString();

    console.log("Purchase button clicked", serviceId, usageMinute, totalPrice);

    try {
      const result = await callMethodCustom(
        SEALEON_CONTRACK,
        "pay_service",
        {
          service_id: serviceId,
          usage_minute: usageMinute,
        },
        `http://localhost:3000/success-page?uuid=${params.uuid}`, // UUID를 쿼리 파라미터로 추가
        "30000000000000",
        totalPrice
      );

      console.log("Contract call result:", result);
    } catch (error) {
      console.error("Contract call failed:", error);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${LOCAL_URL}/services`);
        // serviceId에 해당하는 서비스만 필터링
        const matchedService = response.data.find(
          (service) => service.uuid === params.uuid
        );
        setService(matchedService); // 일치하는 서비스 데이터를 상태에 저장
        console.log("Matched service fetched successfully:", matchedService);
      } catch (error) {
        console.error("There was an error fetching the services:", error);
      }
    };

    fetchServices();
  }, [params.uuid]); // params.serviceId가 변경될 때마다 이펙트를 다시 실행

  useEffect(() => {
    setLoading(true); // 로딩 시작
    const fetchService = async () => {
      try {
        const response = await axios.get(`${LOCAL_URL}/services`);
        // serviceId에 해당하는 서비스만 필터링
        const matchedService = response.data.find(
          (service) => service.uuid === params.uuid
        );
        setService(matchedService); // 일치하는 서비스 데이터를 상태에 저장
        console.log("Matched service fetched successfully:", matchedService);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchService();
  }, [params.uuid]);

  if (loading) {
    return <LoadingUI />; // 로딩 중이면 로딩 UI 표시
  }

  if (!service) {
    return <div>No service found.</div>; // 서비스가 없으면 메시지 표시
  }

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <LoadingUI />
      ) : (
        <>
          <div className={styles.titleContainer}>
            <div className={styles.titleLeftCtn}>
              <div className={styles.title}>{serviceName}</div>
              <div className={styles.tagContainer}>
                {tags &&
                  tags.map((tag, index) => (
                    <span className={styles.tag} key={index}>
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
            <div className={styles.titleRightCtn}>{serviceDescription}</div>
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.galleryContainer}>
              {screenshot && (
                <img
                  src={`${screenshot}`}
                  alt="screen shot"
                  className={styles.infoImg}
                />
              )}
            </div>
            <div className={styles.descriptionContainer}>
              <h2 className={styles.descriptionTitle}>Service Details</h2>
              <div className={styles.descriptionContents}>
                {serviceLongDescription}
              </div>
            </div>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.priceTopContainer}>
              <div className={styles.smallTag}>Affordable</div>
              <div className={styles.priceTitle}>Pricing</div>
              <div className={styles.description}>
                Experience AI services at reasonable prices.
              </div>
            </div>

            <div className={styles.priceBottomContainer}>
              <div className={styles.checklistContainer}>
                <div className={styles.checklistContents}>
                  <Image
                    src={Simbol}
                    width={32}
                    height={32}
                    alt="Sealion_logo"
                  />
                  <div className={styles.checklistWrap}>
                    <div className={styles.checklistTitle}>Check This</div>
                    <div className={styles.checklistDescription}>
                      f you finish before the prepaid hour, we'll refund the
                      unused time on a per-minute basis{" "}
                    </div>
                  </div>
                </div>

                <div className={styles.checklistContents}>
                  <Image
                    src={Simbol}
                    width={32}
                    height={32}
                    alt="Sealion_logo"
                  />
                  <div className={styles.checklistWrap}>
                    <div className={styles.checklistTitle}>Check This</div>
                    <div className={styles.checklistDescription}>
                      If you couldn't utilize the service properly due to
                      hosting issues, raise your concerns with governance by
                      providing screenshots or video recordings.{" "}
                    </div>
                  </div>
                </div>

                <div className={styles.checklistContents}>
                  <Image
                    src={Simbol}
                    width={32}
                    height={32}
                    alt="Sealion_logo"
                  />
                  <div className={styles.checklistWrap}>
                    <div className={styles.checklistTitle}>Check This</div>
                    <div className={styles.checklistDescription}>
                      You are free to use the service anytime if there's a host
                      available 24/7.
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.priceInfoContainer}>
                <div className={styles.topContainer}>
                  <div className={styles.purchaseTitleWrap}>
                    <div className={styles.purchaseTitle}>Price</div>
                    <div className={styles.purchaseDescription}>
                      Price per Hour:
                    </div>
                  </div>
                  <div className={styles.price}>
                    {basePricePerHour.toFixed(4)} NEAR / hr
                  </div>
                </div>
                <div className={styles.lineWrap}>
                  <div className={styles.line} />
                </div>

                <div className={styles.middleContainer}>
                  <input
                    type="range"
                    min="1"
                    max={maxHours}
                    value={time}
                    onChange={handleSliderChange}
                    className={styles.slider}
                  />
                  <div className={styles.totalpriceWrap}>
                    <div>Selected Time: {time} hour(s)</div>
                    <div className={styles.priceDisplay}>
                      total price: {totalPrice.toFixed(4)} NEAR
                    </div>
                  </div>
                </div>
                <div className={styles.lineWrap}>
                  <div className={styles.line} />
                </div>
                <ButtonBasic
                  onClick={() =>
                    onClickPurchaseButton(id, time, basePricePerHour)
                  }
                  buttonText="Get Started"
                  width={552}
                  height={48}
                />
                {/* <button className={styles.purchaseBtn}>Get Started</button> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
