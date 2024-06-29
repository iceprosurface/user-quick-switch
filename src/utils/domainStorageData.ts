export function getDomainStorageData(
  typeOfStorage: "local" | "session" = "local",
) {
  try {
    const selectedStorage =
      typeOfStorage === "local" ? localStorage : sessionStorage;
    const values: string[] = [];
    if (selectedStorage) {
      for (let i = 0; i < selectedStorage?.length; i++) {
        const key = selectedStorage.key(i);
        if (key) {
          values.push(key);
        }
      }
    }
    console.log(
      "getDomainStorageData-typeOfStorage-values",
      typeOfStorage,
      values?.length || 0,
    );
    return values;
  } catch (err) {
    console.error("Error occured in getDomainStorageData", typeOfStorage, err);
  }
}

export function getDomainStorageDataRecordByKeys(
  typeOfStorage: "local" | "session",
  keys: string[],
) {
  try {
    const selectedStorage =
      typeOfStorage === "local" ? localStorage : sessionStorage;
    const record: Record<string, string> = {};
    if (selectedStorage) {
      for (const key of keys) {
        const value = selectedStorage.getItem(key);
        if (value) {
          record[key] = value;
        }
      }
    }
    console.log(
      "getDomainStorageDataRecordByKeys-typeOfStorage-record",
      typeOfStorage,
      record,
    );
    return record;
  } catch (err) {
    console.error(
      "Error occured in getDomainStorageDataRecordByKeys",
      typeOfStorage,
      err,
    );
  }
}

export function setDomainStorageData(
  typeOfStorage: "local" | "session",
  record: Record<string, string>,
) {
  try {
    const selectedStorage =
      typeOfStorage === "local" ? localStorage : sessionStorage;
    if (selectedStorage) {
      for (const key in record) {
        selectedStorage.setItem(key, record[key]);
      }
    }
    console.log(
      "setDomainStorageData-typeOfStorage-record",
      typeOfStorage,
      record,
    );
  } catch (err) {
    console.error("Error occured in setDomainStorageData", typeOfStorage, err);
  }
}
