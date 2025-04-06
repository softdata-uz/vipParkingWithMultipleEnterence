
import store from "store2";

const storageAPI = (type) => ({
    get: (key) => store[type].get(key),
    set: (key, value) => store[type].set(key, value),
    remove: (key) => store[type].remove(key),
});

const storage = {
    local: storageAPI("local"),
    session: storageAPI("session"),
};

export default storage;
