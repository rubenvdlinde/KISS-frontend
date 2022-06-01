export function useContactmomentService(): ServiceData {
  // fetch("http://localhost/api/contactmomenten")
  //   .then((r) => {
  //     if (!r.ok) console.log(r);
  //     return r.json();
  //   })
  //   .then((json) => {
  //     console.log(json);
  //   });

  if (!window.contactmomentenBaseUri) {
    console.console.error("contactmomentenBaseUri missing");
  }

  const url = window.contactmomentenBaseUri;

  const save = (data: Contactmoment) => {
    console.log("save", url, data);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.status.toString());
        return r.json();
      })
      .then((json) => {
        console.log(json);

        //even controleeren of hij opgeslagen is...
        fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(r.status.toString());
            return r.json();
          })
          .then((json) => {
            console.log(json);
          });
      });
  };
  return {
    save: save,
  };
}
