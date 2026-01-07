import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "../ListView/styles";
import { Colors } from "../../Utils";
import { useTheme } from "@react-navigation/native";

// Helper function to clean and generate testID from question
const cleanTestID = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50); // Limit length
};

const ListItems = ({ index, item, handleListClick }) => {
  const theme = useTheme()?.colors;
  const testID = `sem-item-${cleanTestID(item?.question)}-${index}`;
  const accessibilityLabel = item?.question || `Semester item ${index + 1}`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleListClick(item)}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={true}
      style={[
        theme?.themeType === "dark"
          ? [
              styles?.listItemContainer,
              {
                backgroundColor: theme?.bgColor,
              },
            ]
          : [
              styles?.listItemContainer,
              {
                backgroundColor:
                  index % 2 == 0 ? Colors?.BROWN : Colors?.DARKPURPLE,
              },
            ],
      ]}
    >
      <Text style={styles?.textStyleList}>{item?.question}</Text>
    </TouchableOpacity>
  );
};

function arePropsEqual(prevProps, nextProps) {
  // return nextProps === prevProps;
  return nextProps?.item === prevProps?.item;
}

export default memo(ListItems, arePropsEqual);
