"use client";

import { Link } from "react-bootstrap-icons";
import styles from "./mypage.module.scss";
import { useState, useEffect } from "react";
import { useWallet } from "@/wallets/wallet-selector";
import axios from "axios";
import { SEALEON_CONTRACK, LOCAL_URL } from "@/config";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  const { signedAccountId, viewMethod, callMethod } = useWallet();
  const [consumerServices, setConsumerServices] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [earnings, setEarnings] = useState();
  const penalties = [
    { reason: "Service Down", amount: "0.5 NEAR", dueDate: "2023-02-01" },
    { reason: "Claim Penalty", amount: "0.7 NEAR", dueDate: "2023-03-01" },
    { reason: "Emergency Stop", amount: "0.05 NEAR", dueDate: "2023-04-01" },
  ];

  const timeStampToDate = (timestamp) => {
    const date = new Date(parseInt(timestamp / 1000000));
    const year = date.getFullYear().toString().slice(-2); // 'YYYY'의 마지막 2자리
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 'MM' 형식
    const day = date.getDate().toString().padStart(2, "0"); // 'DD' 형식
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // 'mm' 형식
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0시는 12로 표시
    hours = hours.toString().padStart(2, "0"); // 'HH' 형식

    return `${year}.${month}.${day}. ${hours}:${minutes}${ampm}`;
  };

  const changeToTime = (timestampEnd) => {
    const now_timestamp = new Date().getTime() * 1000000; // 현재 시간을 나노세컨드로 변환합니다.
    const difference = Math.abs((timestampEnd - now_timestamp) / 1000000); // 현재 시간과 주어진 타임스탬프의 차이(절대값)를 계산합니다.
    const minDifference = difference / (1000 * 60); // 밀리초 단위의 차이를 시간 단위로 변환합니다.

    return Math.round(minDifference);
  };

  const calculateCurrentCost = (startTimestamp, costPerMin) => {
    const now_timestamp = new Date().getTime() * 1000000; // 현재 시간을 나노세컨드로 변환합니다.
    const timeDiff = (now_timestamp - startTimestamp) / 1000000; // 밀리초 단위의 차이
    const minDiff = Math.floor(timeDiff / (1000 * 60)); // 시간 단위로 변환 후 내림
    const currentCost = (costPerMin * minDiff) / Math.pow(10, 24); // 시간당 비용을 시간 차이만큼 곱하여 현재 비용을 계산합니다.
    return currentCost.toFixed(4);
  };

  const onClickGoService = (uuid) => {
    router.push("/playground/" + uuid);
  };

  useEffect(() => {
    const fetchConsumerServices = async () => {
      try {
        const response = await axios.get(`${LOCAL_URL}/services/consumer`, {
          headers: {
            signedAccountId: signedAccountId,
          },
        });
        setConsumerServices(response.data); // 상태 업데이트
        console.log("Consumer services fetched:", response.data);
      } catch (error) {
        console.error("Consumer services fetching error:", error);
      }
    };

    const fetchProviderServices = async () => {
      try {
        const response = await axios.get(`${LOCAL_URL}/services/provider`, {
          headers: {
            signedAccountId: signedAccountId,
          },
        });
        setProviderServices(response.data); // 상태 업데이트
        console.log("Provider services fetched:", response.data);
      } catch (error) {
        console.error("Provider services fetching error:", error);
      }
    };

    const fetchMyInfoServices = async () => {
      try {
        const response = await axios.get(`${LOCAL_URL}/provider/earning`, {
          headers: {
            signedAccountId: signedAccountId,
          },
        });
        setEarnings(response.data); // 상태 업데이트
        console.log("Provider earning fetched:", response.data);
      } catch (error) {
        console.error("Provider earning fetching error:", error);
      }
    };

    if (signedAccountId) {
      // 두 비동기 요청을 병렬로 실행
      Promise.all([
        fetchConsumerServices(),
        fetchProviderServices(),
        fetchMyInfoServices(),
      ]).catch(console.error);
    }
  }, [signedAccountId]);

  const onClickStopServiceButton = async (serviceId) => {
    try {
      const result = await callMethod(SEALEON_CONTRACK, "stop_use_service", {
        service_id: serviceId,
      });

      console.log("Contract call result:", result);
    } catch (error) {
      console.error("Contract call failed:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.myInfo}>
        <h2 className={styles.heading}>My Page</h2>
        <p className={styles.infoLine}>
          Wallet Address
          <span className={styles.infoValue}>{signedAccountId}</span>
        </p>
        <p className={styles.infoLine}>
          Earnings{" "}
          <span className={styles.infoValue}>
            {earnings && earnings.earned / Math.pow(10, 24)} NEAR
          </span>
        </p>
        <p className={styles.infoLine}>
          Pending Earnings
          <span className={styles.infoValue}>
            {earnings && earnings.pendingEarn / Math.pow(10, 24)} NEAR
          </span>
        </p>
      </div>

      <div className={styles.otherSections}>
        <div className={styles.section}>
          <h2 className={styles.heading}>AI Service Usage</h2>
          <div className={styles.row}>
            <span className={styles.infoValueColor}>Service Name</span>
            <span className={styles.infoValueColor}>Usage Start</span>
            <span className={styles.infoValueColor}>Usage End</span>
            <span className={styles.infoValueColor}>Remaining Time</span>
            <span className={styles.infoValueColor}>Provider</span>
            <span className={styles.infoValueColor}>Service Link</span>
            <span className={styles.infoValueColor}>Resource Link</span>
            <span className={styles.infoValueColor}>Expenditure</span>
            <span className={styles.infoValueColor}></span>{" "}
            {/* For the button */}
          </div>
          {consumerServices ? (
            <div className={styles.row}>
              <span
                className={styles.infoValue}
                onClick={() => onClickGoService(consumerServices.uuid)}
              >
                {consumerServices.serviceName}
              </span>
              <span className={styles.infoValue}>
                {consumerServices.start_timestamp &&
                  timeStampToDate(consumerServices.startUseTimeStamp)}
              </span>
              <span className={styles.infoValue}>
                {consumerServices.end_timestamp &&
                  timeStampToDate(consumerServices.endUseTimeStamp)}
              </span>
              <span className={styles.infoValue}>
                {changeToTime(
                  consumerServices.endUseTimeStamp,
                  consumerServices.startUseTimeStamp
                )}{" "}
                minutes
              </span>
              <span className={styles.infoValue}>
                {consumerServices.providerAddress}
              </span>
              <a
                href={consumerServices.serviceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Link />
              </a>
              <a
                href={consumerServices.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Link />
              </a>

              <span className={styles.infoValue}>
                {
                  -calculateCurrentCost(
                    consumerServices.startUseTimeStamp,
                    consumerServices.price_per_minute_mantissa
                  )
                }{" "}
                NEAR
              </span>
              <button
                className={styles.button}
                onClick={() => onClickStopServiceButton(consumerServices.id)}
              >
                Stop Service
              </button>
            </div>
          ) : (
            <p>No consumer services found.</p> // 컨슈머 서비스가 없을 때 메시지
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.heading}>Hosting AI Service</h2>
          <div className={styles.row}>
            <span className={styles.infoValueColor}>Service Name</span>
            <span className={styles.infoValueColor}>Hosting Start</span>
            <span className={styles.infoValueColor}>Current User End</span>
            <span className={styles.infoValueColor}>Hosting End</span>
            <span className={styles.infoValueColor}>Status</span>
            <span className={styles.infoValueColor}>
              Accrued Real-time Earnings
            </span>
            <span className={styles.infoValueColor}></span>{" "}
            {/* For the button */}
          </div>
          {providerServices.length > 0 ? (
            providerServices.map((service, index) => (
              <div key={index} className={styles.row}>
                <button
                  className={styles.infoValue}
                  onClick={() => onClickGoService(service.uuid)}
                >
                  {service.serviceName}
                </button>
                <span className={styles.infoValue}>
                  {service.start_timestamp &&
                    timeStampToDate(service.start_timestamp)}
                </span>
                <span className={styles.infoValue}>
                  {service.lastPayLog?.dueTimestamp &&
                    timeStampToDate(service.lastPayLog.dueTimestamp)}
                </span>
                <span className={styles.infoValue}>
                  {service.end_timestamp &&
                    timeStampToDate(service.end_timestamp)}
                </span>
                <span className={styles.infoValue}>
                  {service.isUsing ? "In use" : "Not in use"}
                </span>
                <span className={styles.infoValue}>
                  {service.lastPayLog &&
                    calculateCurrentCost(
                      service.lastPayLog.createAt,
                      service.price_per_minute_mantissa
                    )}
                  {service.lastPayLog ? <> NEAR</> : <>0 NEAR</>}
                </span>
                {service.isUsing ? (
                  <button className={styles.button}>Emergency Stop</button>
                ) : (
                  <button className={styles.button}>Stop Service</button>
                )}
              </div>
            ))
          ) : (
            <p>No provider services found.</p>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.heading}>Claim List</h2>
          <p className={styles.infoLine}>No current claims.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.heading}>Penalty Payment</h2>
          <div className={styles.row}>
            <span className={styles.infoValueColor}>Reason</span>
            <span className={styles.infoValueColor}>Amount</span>
            <span className={styles.infoValueColor}>Due Date</span>
            <span className={styles.infoValueColor}></span>{" "}
            {/* For the button */}
          </div>
          {penalties.map((penalty, index) => (
            <div key={index} className={styles.row}>
              {Object.values(penalty).map((value, idx) => (
                <span key={idx} className={styles.infoValue}>
                  {value}
                </span>
              ))}
              <button className={styles.button}>Pay Penalty</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
