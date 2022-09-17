import { Button } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Text } from "../../../../components";
import { useTheme } from "@rneui/themed";

import { TextInput, View } from "react-native";
import { Formik } from "formik";

const PasswordModal = ({ isVisible, onPress, onCancel }) => {
  const { theme } = useTheme();
  return (
    <Dialog isVisible={isVisible} onBackdropPress={onCancel}>
      <Text type="h2" color="black">
        Change Password
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Enter your current password, and your new one.
      </Text>

      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Enter current password"
            />
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Enter current password"
            />
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Enter current password"
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>

      <Dialog.Actions>
        <Button
        onPress={onPress}
          title="Save"
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={onCancel}
          type="clear"
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default PasswordModal;
