export function useContactmomentService(): ServiceData {
  const url = "https://...."; //env var

  const save = (data: Contactmoment) => {
    console.log("save", url, data);
    fetch(url, data)
      .then((r) => {
        if (!r.ok) throw new Error(r.status.toString());
        return r.json();
      })
      .then((json) => {
        console.log(json);
      });
  };
  return {
    save: save,
  };
}
