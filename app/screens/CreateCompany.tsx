import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { get, post } from "../axios";
import * as ImagePicker from "expo-image-picker";

interface Props {
  navigation: NativeStackNavigationProp<any, "CreateCompany">;
  id?: number;
}

interface DropDownSchema {
  label: string;
  value: string;
}

interface Company {
  name: string;
  website: string;
  industry: string;
  organizationSize: string;
}

const CreateCompany = ({ navigation, id }: Props) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [image, setImage] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      var filename = result.assets[0].fileName?.toLocaleLowerCase();
      if (filename) {
        var extension = filename?.substring(filename.lastIndexOf(".") + 1);
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png"
        ) {
          let type =
            extension === "jpg" || extension === "jpeg"
              ? "image/jpeg"
              : "image/png";
          setImage(`data:${type};base64,${result.assets[0].base64}`);
        }
      } else {
        setImage(result.assets[0].uri);
      }
    }
  };

  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      // aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);
    if (!result.canceled) {
      console.log(result.assets[0]);
      var filename = result.assets[0].fileName?.toLocaleLowerCase();
      if (filename) {
        var extension = filename?.substring(filename.lastIndexOf(".") + 1);
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png"
        ) {
          let type =
            extension === "jpg" || extension === "jpeg"
              ? "image/jpeg"
              : "image/png";
          setCoverImage(`data:${type};base64,${result.assets[0].base64}`);
        }
      } else {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");

  const [industry, setInsdustry] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [industryItems, setIndustryItems] = useState([]);

  const [organizationSize, setOrganizationSize] = useState("");
  const [organizationSizeOpen, setOrganizationSizeOpen] = useState(false);
  const [organizationSizeItems, setOrganizationSizeItems] = useState([]);

  useEffect(() => {
    async function fetchIndustryData() {
      // Fetch data
      const { data } = await get("/industry");
      const results: DropDownSchema[] = [];
      // Store results in the results array
      data.forEach((i: string) => {
        results.push({
          label: i,
          value: i,
        });
      });
      // Update the options state
      setIndustryItems(results);
    }

    async function fetchOrganizationSizeData() {
      // Fetch data
      const { data } = await get("/organization-size");
      const results: DropDownSchema[] = [];
      // Store results in the results array
      data.forEach((i: string) => {
        results.push({
          label: i,
          value: i,
        });
      });
      // Update the options state
      setOrganizationSizeItems(results);
    }

    // Trigger the fetch
    fetchIndustryData();
    fetchOrganizationSizeData();
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "white",
        height: Dimensions.get("window").height - 65,
      }}
    >
      <View>
        <View
          style={{
            width: "100%",
            backgroundColor: "#000",
            height: 150,
          }}
        >
          <Pressable onPress={pickCoverImage}>
            <Image
              source={
                coverImage
                  ? coverImage.length > 0
                    ? { uri: coverImage }
                    : require("../assets/empty_cover.jpeg")
                  : require("../assets/empty_cover.jpeg")
              }
              style={{ width: Dimensions.get("window").width, height: 150 }}
            ></Image>
          </Pressable>
        </View>
        <Pressable onPress={pickImage}>
          <View
            style={{ alignItems: "flex-start", padding: 10, marginLeft: "5%" }}
          >
            <Image
              source={
                image
                  ? image.length > 0
                    ? { uri: image }
                    : require("../assets/empty.jpeg")
                  : require("../assets/empty.jpeg")
              }
              style={{
                width: 140,
                height: 140,
                borderRadius: 100,
                marginTop: -70,
              }}
            ></Image>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          padding: 30,
          marginHorizontal: 30,
        }}
      >
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter name"
        />

        <TextInput
          style={styles.input}
          value={website}
          onChangeText={(text) => setWebsite(text)}
          placeholder="Enter website"
        />

        <DropDownPicker
          style={styles.dropdownone}
          containerStyle={styles.dropdownContainerStyleOne}
          open={industryOpen}
          value={industry}
          items={industryItems}
          setOpen={setIndustryOpen}
          setValue={setInsdustry}
          placeholder="Select industry"
          //   setItems={setIndustryItems}
        />

        <DropDownPicker
          style={styles.dropdowntwo}
          containerStyle={styles.dropdownContainerStyleTwo}
          listChildContainerStyle={styles.dropdowntwo}
          open={organizationSizeOpen}
          value={organizationSize}
          items={organizationSizeItems}
          setOpen={setOrganizationSizeOpen}
          setValue={setOrganizationSize}
          placeholder="Select Organization Size"
          //   setItems={setIndustryItems}
        />
        <View style={{ marginTop: 60 }}>
          <Button
            title="Setup company"
            color={"black"}
            onPress={async () => {
              await post("/company", {
                name: name,
                website: website,
                industry: industry,
                organization_size: organizationSize,
                image_uri: image,
                cover_image_uri: coverImage,
              })
                .then((res) => {
                  console.log(res);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginBottom: 7,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  wrapper: {
    width: "80%",
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  dropdownone: {
    // marginTop: 12,
    // marginBottom: 12,
    // position: "absolute",
    // position: "relative",
    // zIndex:2,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    shadowColor: "#000000",
  },
  dropdowntwo: {
    // marginTop: 12,
    // marginBottom: 12,
    // position: "relative",
    // zIndex:1,
    // borderWidth: 0,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    // padding: 10,
    // border:10,
    marginBottom: 15,
    shadowColor: "#000000",
  },
  dropdownContainerStyleOne: {
    zIndex: 2,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#bbb",
    borderRadius: 5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainerStyleTwo: {
    zIndex: 1,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#bbb",
    borderRadius: 5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtom: {
    borderRadius: 5,
  },
});

export default CreateCompany;
