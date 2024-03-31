import styles from "@/components/Button/ButtonBasic.module.scss";

export const ButtonBasic = ({
  buttonText,
  onClick,
  invertColor,
  width,
  height,
}) => {
  const buttonClass = invertColor
    ? `${styles.button} ${styles.inverted}`
    : styles.button;

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <button className={buttonClass} onClick={onClick} style={style}>
      {buttonText}
    </button>
  );
};
