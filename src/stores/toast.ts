import { defineStore } from "pinia";
import { asReadOnly } from "./helpers";

type MessageType = "confirm" | "error";

interface ToastParams {
  text: string;
  type?: MessageType;
  timeout?: number;
}

interface Message {
  text: string;
  type: MessageType;
  key: number;
}

let key = 0;

const storeDefinition = defineStore("toast", {
  state: () => ({
    messages: [] as Array<Message>,
  }),
  actions: {
    toast(params: ToastParams) {
      const m = {
        text: params.text,
        type: params.type || "confirm",
        key: (key += 1),
      };
      this.messages.push(m);
      setTimeout(() => {
        const index = this.messages.indexOf(m);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }, params.timeout || 3000);
    },
  },
});

export const useToast = asReadOnly(storeDefinition);
