import React from "react";
import styles from "./ServiceItem.module.scss";

function ServiceItem({ service, onClick }) {
  const {
    thumbnail,
    serviceName: name,
    serviceLongDescription: description,
    price_per_minute_mantissa,
    tags: beforeTags,
    end_timestamp,
    serviceStatus,
    isUsing,
  } = service;

  const removeBrackets = (str) => {
    return str.replace(/[\[\]"']|"\s|"\s"/g, "");
  };

  const cleanTags = (tagsArray) => {
    if (!tagsArray) {
      return [];
    }
    return tagsArray.map((tag) => removeBrackets(tag));
  };
  const tags = cleanTags(beforeTags);
  const price = (price_per_minute_mantissa * 60) / Math.pow(10, 24);
  const deadline = new Date(parseInt(end_timestamp / 1000000)).toLocaleString();
  const isActive = !isUsing;
  const remainingTime = "Unknown";

  return (
    <div
      className={`${styles.serviceItem} ${!isActive ? styles.inactive : ""}`}
      onClick={onClick}
    >
      {/* Use the base64 encoded image */}
      <img src={`${thumbnail}`} alt={name} className={styles.image} />

      <div className={styles.content}>
        <div>
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag.replace(/["\[\]]/g, "")} {/* Clean up the tag format */}
              </span>
            ))}
          </div>

          <h3>{name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div>
          {/* Adjust the price display */}
          <p className={styles.price}>{price.toFixed(4)} NEAR / hr</p>
          <p className={styles.deadline}>Until {deadline}</p>
        </div>
      </div>
      {!isActive && (
        <div className={styles.overlay}>
          {/* Display remaining time */}
          <p className={styles.remainingTime}>In Use</p>
        </div>
      )}
    </div>
  );
}

export default ServiceItem;
