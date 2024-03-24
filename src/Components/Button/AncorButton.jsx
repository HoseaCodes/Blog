import React from "react";
import PropTypes from "prop-types";
import { StyledButtonATag } from "../../Layout/Button/styledButton";

export const AncorButton = ({
    href,
    target,
    primary,
    backgroundColor,
    size,
    shape,
    label,
    icon,
    ...props
}) => {
  const mode = primary ? "button--primary" : "button--secondary";
  return (
    <StyledButtonATag
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={[`button--${size}`, `button--${shape}`, mode].join(" ")}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label && icon ? (
        <>
          {icon} {label}
        </>
      ) : label ? (
        label
      ) : (
        icon
      )}
    </StyledButtonATag>
  );
};

AncorButton.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  shape: PropTypes.oneOf(["round", "oval"]),
  href: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};

AncorButton.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: undefined,
  icon: null,
  shape: "oval",
  href: "google.com",
  target: "_blank",
};
