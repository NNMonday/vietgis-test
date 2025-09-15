import { yupResolver } from "@primevue/forms/resolvers/yup";
import * as yup from "yup";
import { CCCD_REGEX, COORDINATE_BOUNDS, PHONE_REGEX } from "#shared/constants";

export const useBuildingValidation = () => {
  const buildingSchema = yup.object().shape({
    name: yup.string().required("Building name is required."),
    address: yup.string().required("Building address is required."),
    coords: yup.object().shape({
      lat: yup
        .number()
        .typeError("Latitude must be a number")
        .required("Latitude is required.")
        .min(
          COORDINATE_BOUNDS.LATITUDE.MIN,
          "Latitude must be between -90 and 90."
        )
        .max(
          COORDINATE_BOUNDS.LATITUDE.MAX,
          "Latitude must be between -90 and 90."
        ),
      long: yup
        .number()
        .typeError("Longitude must be a number")
        .required("Longitude is required.")
        .min(
          COORDINATE_BOUNDS.LONGITUDE.MIN,
          "Longitude must be between -180 and 180."
        )
        .max(
          COORDINATE_BOUNDS.LONGITUDE.MAX,
          "Longitude must be between -180 and 180."
        ),
    }),
    representative: yup.object().shape({
      name: yup
        .string()
        .optional()
        .transform((val, orig) => (orig === "" ? undefined : val)),
      phone: yup
        .string()
        .optional()
        .transform((val, orig) => (orig === "" ? undefined : val))
        .matches(PHONE_REGEX, "Phone number must be 9–11 digits."),
      cccd: yup
        .string()
        .optional()
        .transform((val, orig) => (orig === "" ? undefined : val))
        .matches(CCCD_REGEX, "CCCD must be 9–12 digits."),
      cccdIssuedDate: yup
        .date()
        .optional()
        .transform((val, orig) => (orig === "" ? undefined : val))
        .typeError("Issued date must be a valid date."),
    }),
  });

  const initialValues = {
    id: -1,
    address: "",
    coords: { lat: 0, long: 0 },
    name: "",
    representative: {
      cccd: "",
      cccdIssuedDate: new Date(),
      name: "",
      phone: "",
    },
  };

  return {
    resolver: yupResolver(buildingSchema),
    initialValues,
  };
};
