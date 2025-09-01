import { ThemeColor } from "@/src/theme/theme-color";
import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

interface ThemedTextProps extends TextProps {
    children: React.ReactNode;
    size?: "xxl" | "xl" | "lg" | "md" | "sm" | "xs" | "body" | "button";
    variant?: "primary" | "secondary" | "tertiary" | "success" | "error";
    style?: TextStyle | TextStyle[];
}

const ThemedText: React.FC<ThemedTextProps> = ({
    children,
    size = "md",
    variant = "primary",
    style,
    ...rest
}) => {
    const getColor = () => {
        switch (variant) {
            case "primary":
                return ThemeColor.text.primary;
            case "secondary":
                return ThemeColor.text.secondary;
            case "tertiary":
                return ThemeColor.text.tertiary;
            case "success":
                return ThemeColor.success;
            case "error":
                return ThemeColor.error;
            default:
                return ThemeColor.text.primary;
        }
    };

    return (
        <Text style={[themedTextStyles[size], { color: getColor() }, style]} {...rest}>
            {children}
        </Text>
    );
};

const themedTextStyles = StyleSheet.create({
    xxl: { fontSize: 30, fontFamily: "ManropeExtraBold" },
    xl: { fontSize: 24, fontFamily: "ManropeBold" },
    lg: { fontSize: 20, fontFamily: "ManropeSemiBold" },
    md: { fontSize: 16, fontFamily: "ManropeMedium" },
    sm: { fontSize: 14, fontFamily: "ManropeRegular" },
    xs: { fontSize: 10, fontFamily: "ManropeRegular" },
    body: { fontSize: 16, fontFamily: "ManropeRegular", color: "#333" },
    button: { fontSize: 16, fontFamily: "ManropeSemiBold" },
});

export default ThemedText;
