import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestsReducer from "./requestSlice";
import themeReducer from "./themeSlice";
import termsReducer from "./termsSlice.js";
import privacyReducer from "./privacySlice.js";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestsReducer,
    theme: themeReducer,
    isterms: termsReducer,
    isprivacy: privacyReducer,
  },
});
export default appStore;
