import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Pressable, View } from "react-native";
import { colors } from "../styles/colors";

type Props = {
  visible: boolean;
  side: "left" | "right";
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
};

export function SidePanel({ visible, side, width, onClose, children }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW = Math.min(width ?? Math.round(screenW * 0.86), 420);
  const x = useRef(new Animated.Value(side === "left" ? -panelW : panelW)).current;

  useEffect(() => {
    Animated.timing(x, {
      toValue: visible ? 0 : side === "left" ? -panelW : panelW,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible, panelW, side, x]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {side === "right" && <View style={{ flex: 1 }} />}
        <Animated.View
          style={{
            width: panelW,
            backgroundColor: colors.card,
            borderLeftWidth: side === "right" ? 1 : 0,
            borderRightWidth: side === "left" ? 1 : 0,
            borderColor: colors.border,
            transform: [{ translateX: x }],
          }}
        >
          {children}
        </Animated.View>
        {side === "left" && <View style={{ flex: 1 }} />}

        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />
      </View>
    </Modal>
  );
}
