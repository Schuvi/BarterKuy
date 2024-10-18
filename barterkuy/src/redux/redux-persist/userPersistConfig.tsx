import { createTransform } from "redux-persist";
import { statePersist } from "@/types/type";
import { UserState } from "@/types/type";
import { initialState } from "../userSlice";

const userTransform = createTransform<UserState, statePersist, any>(
  (inboundState: UserState, key: string | number | symbol): statePersist => {
    const { email, user_id, nama, provinsi, kabupaten, kecamatan } = inboundState;
    return { email, user_id, nama, provinsi, kabupaten, kecamatan };
  },

  (outboundState: statePersist, key: string | number | symbol): UserState => {
    return { ...initialState, ...outboundState };
  },

  { whitelist: ["user"] }
);

export default userTransform;
