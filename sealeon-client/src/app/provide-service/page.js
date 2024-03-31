"use client";

import styles from "./provide-service.module.scss";
import React, { useState, useEffect } from "react";
import { useWallet } from "@/wallets/wallet-selector";
import { SEALEON_CONTRACK, LOCAL_URL } from "@/config";
import axios from "axios";

export default function ProvideServices() {
  const { signedAccountId, viewMethod, callMethod } = useWallet();
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    servicePrice: "",
    serviceDeadline: "",
    serviceLink: "",
    resourceLink: "",
    serviceName: "",
    serviceDescription: "",
    tags: [],
    serviceImage: null, // 이제 단일 이미지만 처리
    serviceSubtitle: "",
    serviceLongDescription: "",
    thumbnailImage: null, // 이제 단일 이미지만 처리
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "serviceImage" || name === "thumbnailImage") {
      console.log(`${name}`, files);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // 첫 번째 파일만 저장
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deadlineTimestamp =
      new Date(formData.serviceDeadline).getTime() * 1000000;
    const pricePerMinuteMantissa =
      Number(formData.servicePrice) * Math.pow(10, 24);

    const formDataToSend = new FormData();
    formDataToSend.append("serviceLink", formData.serviceLink);
    formDataToSend.append("resourceLink", formData.resourceLink);
    formDataToSend.append("serviceName", formData.serviceName);
    formDataToSend.append("serviceDescription", formData.serviceDescription);
    formDataToSend.append("tags", JSON.stringify(formData.tags));
    formDataToSend.append("serviceSubtitle", formData.serviceSubtitle);
    formDataToSend.append(
      "serviceLongDescription",
      formData.serviceLongDescription
    );
    if (formData.thumbnailImage) {
      formDataToSend.append("thumbnail", formData.thumbnailImage);
    }

    if (formData.serviceImage) {
      formDataToSend.append("serviceImage", formData.serviceImage);
    }

    try {
      const response = await axios.post(
        `${LOCAL_URL}/register-service`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            signedAccountId: signedAccountId,
          },
        }
      );

      console.log("Backend call result:", response.data);

      const { uuid } = response.data;

      if (uuid) {
        const result = await callMethod(SEALEON_CONTRACK, "register_service", {
          uuid: uuid,
          price_per_minute_mantissa: pricePerMinuteMantissa.toString(),
          end_timestamp: deadlineTimestamp.toString(),
        });

        console.log("Contract call result:", result);
      } else {
        console.error("Failed to get uuid from backend response");
      }
    } catch (error) {
      alert("Failed to register service");
      console.error("Request failed:", error);
    }
  };

  const onClickViewHandler = async () => {
    const result = await viewMethod(SEALEON_CONTRACK, "get_admin_address");
    console.log("view get_admin_address", result);
    const result2 = await viewMethod(SEALEON_CONTRACK, "get_service_list");
    console.log("view get_service_list", result2);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="serviceName">Service Name</label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceSubtitle">Service Subtitle</label>
          <input
            type="text"
            id="serviceSubtitle"
            name="serviceSubtitle"
            value={formData.serviceSubtitle}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="servicePrice">Service Price</label>
          <input
            type="number"
            id="servicePrice"
            name="servicePrice"
            value={formData.servicePrice}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceDeadline">Service Deadline</label>
          <input
            type="datetime-local"
            id="serviceDeadline"
            name="serviceDeadline"
            value={formData.serviceDeadline}
            onChange={handleChange}
            className={styles.inputDateTimeLocal} // Ensure this class name matches what you've defined in your SCSS
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceLink">Service Link</label>
          <input
            type="text"
            id="serviceLink"
            name="serviceLink"
            value={formData.serviceLink}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="resourceLink">Resource Link</label>
          <input
            type="text"
            id="resourceLink"
            name="resourceLink"
            value={formData.resourceLink}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceDescription">Service Description</label>
          <textarea
            id="serviceDescription"
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="thumbnailImage">Thumbnail Image</label>
          <input
            type="file"
            id="thumbnailImage"
            name="thumbnailImage"
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceImage">Service Image</label>
          <input
            type="file"
            id="serviceImage"
            name="serviceImage"
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="serviceLongDescription">
            Service Long Description
          </label>
          <textarea
            id="serviceLongDescription"
            name="serviceLongDescription"
            value={formData.serviceLongDescription}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleKeyDown}
            placeholder="Enter tags"
          />
          <div className={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className={styles.tag}
                onClick={() => removeTag(index)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
      <button onClick={onClickViewHandler}>view test</button>
    </>
  );
}
