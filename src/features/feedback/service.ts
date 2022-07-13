//import { ServiceResult } from "@/services";

import type { Feedback, ServiceResult } from "./types";
import { ref } from "vue";

export function useFeedbackService() {
  if (!window.gatewayBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  const feedbackUrl = window.gatewayBaseUri + "/reviews";

  const postFeedback = (data: Feedback) => {
    const state = ref(<ServiceResult>{ loading: true, error: false });

    const promise = fetch(feedbackUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(MapModel(data)),
    })
      .then((r) => {
        if (!r.ok) {
          state.value.error = true;
          throw new Error();
        }
        state.value.success = true;
        return r.json();
      })
      .catch(() => {
        state.value.error = true;
      })
      .finally(() => {
        state.value.loading = false;
      });

    const result = { state: state, promise: promise };

    return result;
  };

  return {
    postFeedback,
  };
}

function MapModel(feedbackModel: Feedback) {
  if (!feedbackModel) {
    throw new Error("Missing pramater feedbackModel");
  }
  return {
    topic: feedbackModel.uri,
    name: feedbackModel.naam,
    description: `Content\r\n${feedbackModel.content}\r\nOpmerking\r\n${feedbackModel.opmerking}\r\nAanleiding\r\n${feedbackModel.aanleiding}\r\nContctgegevens\r\n${feedbackModel.contactgegevens}`,
  };
}
