import XLSX from "xlsx";

export default async function getJSONFromFile(file, listIndex = 0) {
  const transformResult = (data) => {
    if (data.length <= 0) {
      throw new Error("Таблица пустая");
    } else {
      const cars = data
        && data.length > 0
        && Object.keys(data[0])
          .filter(field => field !== 'НАИМЕНОВАНИЕ УСЛУГИ')
          .map(field => ({
        label: field,
        value: field
      }));
      const workNames = data.reduce((acc, item) => {
        acc.push(item['НАИМЕНОВАНИЕ УСЛУГИ'])
        return acc
      }, [])
      const prices = new Map()
      data.forEach(item => {
        prices.set(item['НАИМЕНОВАНИЕ УСЛУГИ'], item)
      })
      return {cars, workNames, prices}
    }

  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const {target} = e;
      if (target?.result) {
        const workbook = XLSX.read(target.result);
        const sheet = workbook.SheetNames[listIndex];
        if (!sheet) {
          reject(new Error(`Ошибка получения ${listIndex} листа`));
        }
        const result = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet],
          {
            defval: ""
          }
        );
        if (result) {
          resolve(transformResult(result));
        }
        reject(new Error("Ошибка преобразования файла"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
