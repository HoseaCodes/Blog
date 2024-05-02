import React from "react";
import PropTypes from "prop-types";
import { HeroText } from "../../Layout/Hero/styledHero";

export const TitleFont = ({
    primary,
    position,
    size,
    label,
    icon,
    ...props
}) => {
  const mode = primary ? "button--primary" : "button--secondary";
  return (
    <HeroText
      position
      {...props}
      className={[`button--${size}`, mode].join(" ")}
    >
      {label}
    </HeroText>
  );
};

TitleFont.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  position: PropTypes.oneOf(["Left", "Right"])
};

TitleFont.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: undefined,
  icon: null,
  position: "Left",
};
