import React from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Colors } from "../../Utils";

const MainButton = (props) => {
  // Generate testID from title if not provided
  const getTestID = () => {
    if (props?.testID) return props.testID;
    if (props?.title) {
      return `button-${props.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    }
    return 'mainButton';
  };

  return (
    <TouchableOpacity
      disabled={props?.disabled ?? false}
      activeOpacity={0.8}
      testID={getTestID()}
      accessibilityLabel={props?.title || 'Button'}
      accessible={true}
      style={[
        styles?.buttonTouch,
        {
          width: props?.buttonWidth ?? "90%",
          borderRadius: props?.borderRadius ?? 5,
          backgroundColor:
            props?.disabled === true ? Colors?.LIGHTGREY : Colors?.PRIMARY,
        },
      ]}
      onPress={() => {
        props?.mainButtonPress();
      }}
    >
      {props?.image ? (
        <Image
          style={{ width: 20, height: 20, marginRight: 5 }}
          source={props?.image}
        />
      ) : null}
      <Text style={styles?.titleStyle}>{props?.title}</Text>
    </TouchableOpacity>
  );
};

export default MainButton;
