//import { ref } from "vue";

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

  // const saving = ref(false);
  // const saved = ref(false);

  const save = (data: Contactmoment) => {
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      // saving.value = false;
      // if (!r.ok) throw new Error(r.status.toString());
      // saved.value = true;
      // return r.json();

  
      return r.ok;
    });
    // .then((json) => {
    //   //console.log(json);

    //   return json;
    //   //even controleeren of hij opgeslagen is...
    //   // fetch(url)
    //   //   .then((r) => {
    //   //     if (!r.ok) throw new Error(r.status.toString());
    //   //     return r.json();
    //   //   })
    //   //   .then((json) => {
    //   //     console.log(json);
    //   //   });
    // });
  };
  return {
    save,
    // saving,
    // saved,
  };
}
