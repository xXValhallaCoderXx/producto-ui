// import { useState, useEffect } from "react";
// import { Button } from "@rneui/themed";
// import { Dialog } from "@rneui/themed";
// import { Text } from "../../../../components";
// import { useTheme } from "@rneui/themed";
// import { TextInput } from "react-native-paper";
// import { useFormik } from "formik";
// import { View } from "react-native";

// const ChangeEmailModal = ({
//   isVisible,
//   onPress,
//   onCancel,
//   isLoading,
//   serverError,
//   isSuccess,
// }) => {
//   const { theme } = useTheme();
//   const [error, setError] = useState("");
//   const [secretMap, setSecretMap] = useState({});

//   const formik = useFormik({
//     initialValues: {
//       password: "",
//       email: "",
//     },
//     onSubmit: (values) => {
//       if (values.password === "") {
//         setError("Please enter password");
//       } else if (values.password === "" || values.email === "") {
//         setError("Please enter all required fields");
//       } else {
//         onPress(values);
//       }
//     },
//   });

//   useEffect(() => {
//     setError("");
//   }, [formik.values]);

//   useEffect(() => {
//     if (isSuccess) {
//       formik.resetForm();
//       onCancel();
//     }
//   }, [isSuccess]);

//   const handleOnSubmit = () => {
//     formik.handleSubmit();
//   };

//   const handleClose = () => {
//     formik.resetForm();
//     onCancel();
//   };

//   const handlePassToggle = (key) => () => {
//     setSecretMap({
//       ...secretMap,
//       [key]: secretMap[key] ? false : true,
//     });
//   };

//   return (
//     <Dialog isVisible={isVisible} onBackdropPress={handleClose}>
//       <Text type="h2" color="black">
//         Change Email
//       </Text>
//       <Text
//         type="h3"
//         color="secondary"
//         customStyle={{ marginTop: 15, marginBottom: 15 }}
//       >
//         Enter your current password, and your new email.
//       </Text>

//       <View
//         style={{ display: "flex", height: 150, justifyContent: "space-around" }}
//       >
//         <TextInput
//           onChangeText={formik.handleChange("password")}
//           autoFocus
//           onBlur={formik.handleBlur("password")}
//           value={formik.values.password}
//           mode="outlined"
//           label="Password"
//           placeholder="Enter current password"
//           style={{
//             backgroundColor: "white",
//           }}
//           secureTextEntry={secretMap["password"] ? true : false}
//           right={
//             <TextInput.Icon onPress={handlePassToggle("password")} icon="eye" />
//           }
//         />

//         <TextInput
//           onChangeText={formik.handleChange("email")}
//           onBlur={formik.handleBlur("email")}
//           value={formik.values.email}
//           mode="outlined"
//           label="New Email"
//           placeholder="Enter a new email"
//           style={{
//             backgroundColor: "white",
//           }}
//         />
//       </View>
//       <View style={{ height: 20 }}>
//         {error || serverError ? (
//           <Text type="h4" color="error">
//             {error || serverError}
//           </Text>
//         ) : null}
//       </View>

//       <Dialog.Actions>
//         <Button
//           onPress={handleOnSubmit}
//           title="Save"
//           containerStyle={{ paddingLeft: 25 }}
//           titleStyle={{ color: theme.colors.primary }}
//           type="clear"
//           disabled={isLoading}
//         />
//         <Button
//           title="Cancel"
//           titleStyle={{ color: theme.colors.primary }}
//           onPress={handleClose}
//           type="clear"
//           disabled={isLoading}
//         />
//       </Dialog.Actions>
//     </Dialog>
//   );
// };

// export default ChangeEmailModal;
