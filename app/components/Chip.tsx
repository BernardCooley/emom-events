import { Tag, TagLabel } from "@chakra-ui/react";
import React, { CSSProperties, ReactNode } from "react";

type Props = {
    size?: "sm" | "md" | "lg";
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    label: string;
    styles?: CSSProperties;
};

const Chip = ({ size = "md", leftIcon, rightIcon, label, styles }: Props) => {
    const defaultStyles = {
        height: "auto",
        fontSize: "14px",
        borderRadius: "6px",
        fontWeight: 700,
        lineHeight: "20px",
        color: "brand.darkText",
        backgroundColor: "transparent",
    };

    return (
        <Tag
            sx={{ ...defaultStyles, ...styles }}
            size={size}
            paddingY={0}
            paddingLeft="8px"
            paddingRight={rightIcon ? "32px" : "8px"}
        >
            {leftIcon}
            <TagLabel>{label}</TagLabel>
            {rightIcon}
        </Tag>
    );
};

export default Chip;
