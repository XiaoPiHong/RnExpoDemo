import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import useToast from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { updateTokenConfig } from "@/store/slices/userSlice";
import * as apisAuth from "@/apis/auth/auth";
import * as randomUtil from "@/utils/random";
import useI18n from "@/hooks/useI18n";
import * as Crypto from "expo-crypto";
import { stringMd5 } from "react-native-quick-md5";
import { router } from "expo-router";

export default function LoginScreen() {
  const [username, setUserName] = useState("xph-admin");
  const [password, setPassword] = useState("Admin@1234");
  const { t } = useI18n();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const onClickLoginBtn = async () => {
    if (!username || !password) {
      return toast.info(`${t("login.tips.usernameAndPasswordNotNull")}`);
    }
    let nonceStr = "";
    let timestamp = "";
    let signature = "";
    let md5Password = "";
    /** Crypto的在web端需要https，此处用不同的库兼容http的情况 */
    if (Platform.OS === "web") {
      timestamp = Date.now().toString();
      nonceStr = await randomUtil.generateRandomString(16);
      md5Password = stringMd5(password);
      signature = stringMd5(`${nonceStr}${timestamp}${md5Password}`);
    } else {
      timestamp = Date.now().toString();
      nonceStr = await randomUtil.generateRandomString(16);
      md5Password = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.MD5,
        password
      );
      signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.MD5,
        `${nonceStr}${timestamp}${md5Password}`
      );
    }
    console.log({
      username,
      nonceStr,
      timestamp,
      signature,
      clientId: "sso-admin",
    });
    apisAuth
      .postSignInByUsername({
        username,
        nonceStr,
        timestamp,
        signature,
        clientId: "sso-admin",
      })
      .then((res) => {
        const { data } = res;
        dispatch(updateTokenConfig(data));
        router.replace("/explore");
      });
  };

  return (
    <View style={styles.layout}>
      {/**
       * StatusBar用于覆盖Layout的状态栏
       */}
      <StatusBar animated backgroundColor="#fff" style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.logoView}>
          <Image
            source={require("@/assets/images/skout_logo.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={username}
            style={styles.inputText}
            placeholder={`${t("login.username")}`}
            placeholderTextColor="#AFAFAF"
            onChangeText={(username) => setUserName(username)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            value={password}
            style={styles.inputText}
            placeholder={`${t("login.password")}`}
            placeholderTextColor="#AFAFAF"
            secureTextEntry
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <TouchableOpacity style={[styles.loginBtn]} onPress={onClickLoginBtn}>
          <Text style={styles.loginText}>{t("login.upLogin")}</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={{ marginHorizontal: 15 }}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.singUp]}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContentContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
    width: 250,
    height: 100,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#EAEAEA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "#777777",
    fontWeight: "800",
  },
  singUp: {
    fontWeight: "500",
    color: "#2bbca2",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#2bbca2",
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  logoView: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    marginTop: 0,
  },
  forgot: {
    fontWeight: "normal",
  },
});
