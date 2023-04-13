export const passwordCheck = (passwordInputValue) => {
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;

  const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
  const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
  const digitsPassword = digitsRegExp.test(passwordInputValue);
  const specialCharPassword = specialCharRegExp.test(passwordInputValue);

  let errMsg = "";
  if (!uppercasePassword) {
    errMsg = "At least one Uppercase";
  } else if (!lowercasePassword) {
    errMsg = "At least one Lowercase";
  } else if (!digitsPassword) {
    errMsg = "At least one digit";
  } else if (!specialCharPassword) {
    errMsg = "At least one Special Characters";
  } else {
    errMsg = "";
  }

  return errMsg;
};
